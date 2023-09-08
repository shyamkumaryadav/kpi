from django.core.exceptions import MultipleObjectsReturned, ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from djstripe.models import Subscription, Price, Charge

from kobo.apps.organizations.models import Organization
from kpi.fields import KpiUidField


def get_default_add_on_limits():
    return {
        'submissions_limit': 0,
        'asr_seconds_limit': 0,
        'mt_characters_limit': 0,
    }


class PlanAddOn(models.Model):
    id = KpiUidField(uid_prefix='addon_', primary_key=True)
    created = models.DateTimeField()
    organization = models.ForeignKey('organizations.Organization', to_field='id', on_delete=models.SET_NULL, null=True, blank=True)
    usage_limits = models.JSONField(
        default=get_default_add_on_limits,
        help_text='''The historical usage limits when the add-on was purchased. Possible keys:
        "submission_limit", "asr_seconds_limit", and/or "mt_characters_limit"''',
    )
    limits_used = models.JSONField(
        default=get_default_add_on_limits,
        help_text='The amount of each of the add-on\'s individual limits that has been used.',
    )
    product = models.ForeignKey('djstripe.Product', to_field='id', on_delete=models.SET_NULL, null=True, blank=True)
    charge = models.ForeignKey('djstripe.Charge', to_field='id', on_delete=models.CASCADE)
    valid_subscription_products = models.JSONField()

    class Meta:
        verbose_name = 'plan add-on'
        verbose_name_plural = 'plan add-ons'

    @property
    def is_expended(self):
        for limit_type, limit_value in self.usage_limits.items():
            if limit_type in self.limits_used and self.limits_used[limit_type] >= limit_value > 0:
                return True
        return False

    @property
    def is_available(self):
        return self.charge.payment_intent.status == 'succeeded' and not (self.is_expended or self.charge.refunded)


@receiver(post_save, sender=Charge)
def make_add_on_for_charge(sender, instance, created, **kwargs):
    create_or_update_one_time_add_on(instance)


def create_or_update_one_time_add_on(charge):
    payment_intent = charge.payment_intent
    if 'price_id' not in charge.metadata:
        # make sure the charge is for a successful addon purchase
        return

    try:
        product = Price.objects.get(
            id=charge.metadata['price_id']
        ).product
        organization = Organization.objects.get(id=charge.metadata['organization_id'])
    except ObjectDoesNotExist:
        return

    if product.metadata['product_type'] != 'addon':
        # might be some other type of payment
        return

    valid_subscription_products = []
    if 'valid_subscription_products' in product.metadata:
        for product_id in product.metadata['valid_subscription_products'].split(','):
            valid_subscription_products.append(product_id)

    usage_limits = {}
    limits_used = {}
    for limit_type in get_default_add_on_limits().keys():
        if limit_type in charge.metadata:
            limit_value = charge.metadata[limit_type]
            usage_limits[limit_type] = int(limit_value)
            limits_used[limit_type] = 0

    if not len(usage_limits):
        # not a valid plan add-on
        return

    add_on, add_on_created = PlanAddOn.objects.get_or_create(charge=charge, created=charge.created)
    if add_on_created:
        add_on.product = product
        add_on.organization = organization
        add_on.usage_limits = usage_limits
        add_on.limits_used = limits_used
        add_on.valid_subscription_products = valid_subscription_products
        add_on.save()

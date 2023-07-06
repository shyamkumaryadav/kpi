# Generated by Django 3.2.15 on 2023-06-22 20:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import kpi.fields.kpi_uid
import organizations.fields


class Migration(migrations.Migration):

    replaces = [('organizations', '0001_initial'), ('organizations', '0002_alter_organization_id_to_kpiuidfield'), ('organizations', '0003_copy_organization_uid_to_id'), ('organizations', '0004_remove_organization_uid')]

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='The name of the organization', max_length=200)),
                ('is_active', models.BooleanField(default=True)),
                ('created', organizations.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False)),
                ('modified', organizations.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False)),
                ('slug', organizations.fields.SlugField(blank=True, editable=False, help_text='The name in all lowercase, suitable for URL identification', max_length=200, populate_from='name', unique=True)),
                ('uid', kpi.fields.kpi_uid.KpiUidField(_null=False, uid_prefix='org')),
            ],
            options={
                'verbose_name': 'organization',
                'verbose_name_plural': 'organizations',
                'ordering': ['name'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='OrganizationUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', organizations.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False)),
                ('modified', organizations.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organization_users', to='organizations.organization')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organizations_organizationuser', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'organization user',
                'verbose_name_plural': 'organization users',
                'ordering': ['organization', 'user'],
                'abstract': False,
                'unique_together': {('user', 'organization')},
            },
        ),
        migrations.CreateModel(
            name='OrganizationOwner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', organizations.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False)),
                ('modified', organizations.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False)),
                ('organization', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='owner', to='organizations.organization')),
                ('organization_user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='organizations.organizationuser')),
            ],
            options={
                'verbose_name': 'organization owner',
                'verbose_name_plural': 'organization owners',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='OrganizationInvitation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('guid', models.UUIDField(editable=False)),
                ('invitee_identifier', models.CharField(help_text='The contact identifier for the invitee, email, phone number, social media handle, etc.', max_length=1000)),
                ('created', organizations.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False)),
                ('modified', organizations.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False)),
                ('invited_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organizations_organizationinvitation_sent_invitations', to=settings.AUTH_USER_MODEL)),
                ('invitee', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='organizations_organizationinvitation_invitations', to=settings.AUTH_USER_MODEL)),
                ('organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organization_invites', to='organizations.organization')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='organization',
            name='users',
            field=models.ManyToManyField(related_name='organizations_organization', through='organizations.OrganizationUser', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='organization',
            name='id',
            field=kpi.fields.kpi_uid.KpiUidField(_null=False, primary_key=True, uid_prefix='org'),
        ),
        migrations.RemoveField(
            model_name='organization',
            name='uid',
        ),
    ]

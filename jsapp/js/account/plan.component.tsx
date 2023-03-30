import React, {useEffect, useReducer, useState} from 'react';
import styles from './plan.module.scss';
import type {
  BaseSubscription,
  Product,
  Organization,
  BasePrice,
  Price,
} from './stripe.api';
import {
  getOrganization,
  getProducts,
  getSubscription,
  postCheckout,
  postCustomerPortal,
} from './stripe.api';
import Icon from '../components/common/icon';
import Button from 'js/components/common/button';

interface PlanState {
  isLoading: boolean;
  subscribedProduct: BaseSubscription;
  intervalFilter: string;
  filterToggle: boolean;
  products: Product[];
  organization: null | Organization;
  featureTypes: string[];
}

// An interface for our action
interface DataUpdates {
  type: string;
  prodData?: any;
}

const initialState = {
  isLoading: true,
  subscribedProduct: [],
  intervalFilter: 'year',
  filterToggle: false,
  products: [],
  organization: null,
  featureTypes: ['support', 'advanced', 'addons'],
};

function planReducer(state: PlanState, action: DataUpdates) {
  switch (action.type) {
    case 'initialProd':
      return {...state, products: action.prodData};
    case 'initialOrg':
      return {...state, organization: action.prodData};
    case 'initialSub':
      return {...state, subscribedProduct: action.prodData};
    case 'month':
      return {
        ...state,
        intervalFilter: 'month',
        filterToggle: !state.filterToggle,
      };
    case 'year':
      return {
        ...state,
        intervalFilter: 'year',
        filterToggle: !state.filterToggle,
      };
    default:
      return state;
  }
}

export default function Plan() {
  const [state, dispatch] = useReducer(planReducer, initialState);
  const [expandComparison, setExpandComparison] = useState(false);
  const [buttonsDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    getProducts().then((data) => {
      dispatch({
        type: 'initialProd',
        prodData: data.results,
      });
    });

    getOrganization().then((data) => {
      dispatch({
        type: 'initialOrg',
        prodData: data.results[0],
      });
    });

    getSubscription().then((data) => {
      dispatch({
        type: 'initialSub',
        prodData: data.results,
      });
    });
  }, []);

  useEffect(() => {
    checkMetaFeatures();
  }, [state.products]);

  // Filter prices based on plan interval
  const filterPrices = (): Price[] => {
    if (state.products.length > 0) {
      const filterAmount = state.products.map((product: Product) => {
        const filteredPrices = product.prices.filter((price: BasePrice) => {
          const interval = price.human_readable_price.split('/')[1];
          return interval === state.intervalFilter || price.unit_amount === 0;
        });
        return {
          ...product,
          prices: filteredPrices.length ? filteredPrices[0] : null,
        };
      });
      return filterAmount.filter((product: Product) => product.prices);
    }
    return [];
  };

  const isSubscribedProduct = (product: Price) => {
    if (product.prices.unit_amount === 0 && !state.subscribedProduct?.length) {
      return true;
    }
    return product.name === state.subscribedProduct?.name;
  };

  const upgradePlan = (priceId: string) => {
    if (!priceId || buttonsDisabled) {
      return;
    }
    setButtonDisabled(buttonsDisabled);
    postCheckout(priceId, state.organization?.uid)
      .then((data) => {
        if (!data.url) {
          alert(t('There has been an issue, please try again later.'));
        } else window.location.assign(data.url);
      })
      .finally(() => setButtonDisabled(!buttonsDisabled));
  };

  const managePlan = () => {
    if (!state.organization?.uid || buttonsDisabled) {
      return;
    }
    setButtonDisabled(buttonsDisabled);
    postCustomerPortal(state.organization?.uid)
      .then((data) => {
        if (!data.url) {
          alert(t('There has been an issue, please try again later.'));
        } else window.location.assign(data.url);
      })
      .finally(() => setButtonDisabled(!buttonsDisabled));
  };

  // Get feature items and matching icon boolean
  const getListItem = (listType: string, plan: string) => {
    const listItems: {icon: boolean; item: string}[] = [];
    filterPrices().map((price) =>
      Object.keys(price.metadata).map((featureItem: string) => {
        const numberItem = featureItem.lastIndexOf('_');
        const currentResult = featureItem.substring(numberItem + 1);

        const currentIcon = `feature_${listType}_check_${currentResult}`;
        if (
          featureItem.includes(`feature_${listType}_`) &&
          !featureItem.includes(`feature_${listType}_check`) &&
          price.name === plan
        ) {
          const keyName = `feature_${listType}_${currentResult}`;
          let iconBool = false;
          const itemName: string = price.metadata[keyName];
          if (price.metadata[currentIcon] !== undefined) {
            iconBool = JSON.parse(price.metadata[currentIcon]);
            listItems.push({icon: iconBool, item: itemName});
          }
        }
      })
    );
    return listItems;
  };

  const checkMetaFeatures = () => {
    let expandBool = false;
    if (state.products.length >= 0) {
      filterPrices().map((price) => {
        for (const featureItem in price.metadata) {
          if (
            featureItem.includes('feature_support_') ||
            featureItem.includes('feature_advanced_') ||
            featureItem.includes('feature_addon_')
          ) {
            expandBool = true;
            break;
          }
        }
      });
    }
    return expandBool;
  };

  if (!state.products.length) {
    return null;
  }
  return (
    <div className={styles.accountPlan}>
      <div className={styles.plansSection}>
        <form className={styles.intervalToggle}>
          <input
            type='radio'
            id='switch_left'
            name='switchToggle'
            value='year'
            onChange={() => dispatch({type: 'year'})}
            checked={!state.filterToggle}
          />
          <label htmlFor='switch_left'>{t('Annual')}</label>

          <input
            type='radio'
            id='switch_right'
            name='switchToggle'
            value='month'
            onChange={() => dispatch({type: 'month'})}
            checked={state.filterToggle}
          />
          <label htmlFor='switch_right'> {t('Monthly')}</label>
        </form>
        <div
          className={styles.currentPlan}
          style={{
            gridRow: 0,
            gridColumn: 1 + filterPrices().findIndex(isSubscribedProduct),
            display:
              filterPrices().findIndex(isSubscribedProduct) >= 0 ? '' : 'none',
          }}
        >
          {t('your plan')}
        </div>
        {filterPrices().map((price: Price, i: number) => (
          <div className={styles.planContainer} key={i}>
            <h1 className={styles.priceName}> {price.name} </h1>
            <div className={styles.priceTitle}>
              {typeof price.prices.human_readable_price === 'string' &&
                (price.prices.human_readable_price.includes('$0.00')
                  ? t('Free')
                  : price.prices.human_readable_price)}
            </div>

            <ul>
              {Object.keys(price.metadata).map(
                (featureItem: string) =>
                  featureItem.includes('feature_list_') && (
                    <li key={featureItem}>
                      <div className={styles.iconContainer}>
                        <Icon
                          name='check'
                          size='m'
                          classNames={
                            price.name === 'Professional plan'
                              ? [styles.tealCheck]
                              : [styles.stormCheck]
                          }
                        />
                      </div>
                      {price.metadata[featureItem]}
                    </li>
                  )
              )}
            </ul>

            {!isSubscribedProduct(price) && (
              <Button
                type='full'
                color='blue'
                size='m'
                label={t('Upgrade')}
                onClick={() => upgradePlan(price.prices.id)}
                aria-label={`upgrade to ${price.name}`}
                aria-disabled={buttonsDisabled}
                isDisabled={buttonsDisabled}
              />
            )}
            {isSubscribedProduct(price) &&
              state.organization?.uid &&
              price.name !== 'Community plan' && (
                <Button
                  type='full'
                  color='blue'
                  size='m'
                  label={t('Manage')}
                  onClick={managePlan}
                  aria-label={`manage your ${price.name} subscription`}
                  aria-disabled={buttonsDisabled}
                  isDisabled={buttonsDisabled}
                />
              )}

            {expandComparison && (
              <div>
                <hr />
                {state.featureTypes.map(
                  (type) =>
                    getListItem(type, price.name).length > 0 && (
                      <>
                        <h2
                          className={styles.listTitle}
                          id={price.metadata[`feature_${type}_title`]}
                        >
                          {price.metadata[`feature_${type}_title`]}
                        </h2>
                        <ul
                          key={type}
                          aria-labelledby={
                            price.metadata[`feature_${type}_title`]
                          }
                        >
                          {getListItem(type, price.name).map((listItem) =>
                            listItem.icon ? (
                              listItem.icon === true && (
                                <li key={listItem.item}>
                                  <div className={styles.iconContainer}>
                                    <Icon
                                      name='check'
                                      size='m'
                                      classNames={
                                        price.name === 'Professional plan'
                                          ? [styles.tealCheck]
                                          : [styles.stormCheck]
                                      }
                                    />
                                  </div>
                                  {listItem.item}
                                </li>
                              )
                            ) : (
                              <li key={listItem.item}>
                                <div className={styles.iconContainer}>
                                  <Icon
                                    name='close'
                                    size='m'
                                    classNames={[styles.redClose]}
                                  />
                                </div>
                                {listItem.item}
                              </li>
                            )
                          )}
                        </ul>
                      </>
                    )
                )}
              </div>
            )}
          </div>
        ))}

        <div className={styles.enterprisePlan}>
          <h1 className={styles.enterpriseTitle}> {t('Need More?')}</h1>
          <p className={styles.enterpriseDetails}>
            {t(
              'We offer add-on options to increase your limits or the capacity of certain features for a period of time. Scroll down to learn more and purchase add-ons.'
            )}
          </p>
          <p className={styles.enterpriseDetails}>
            {t(
              'If your organization has larger or more specific needs, contact our team to learn about our enterprise options.'
            )}
          </p>
          <div className={styles.enterpriseLink}>
            <a href='https://www.kobotoolbox.org/contact/' target='_blanks'>
              {t('Get in touch for Enterprise options')}
            </a>
          </div>
        </div>
      </div>
      {checkMetaFeatures() && (
        <Button
          type='full'
          color='cloud'
          size='m'
          isFullWidth
          label={
            expandComparison ? t('Collapse') : t('Display full comparison')
          }
          onClick={() => setExpandComparison(!expandComparison)}
          aria-label={
            expandComparison ? t('Collapse') : t('Display full comparison')
          }
        />
      )}
    </div>
  );
}

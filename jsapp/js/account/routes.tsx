import React from 'react';
import {Navigate, Route} from 'react-router-dom';
import RequireAuth from 'js/router/requireAuth';
import {ROUTES} from 'js/router/routerConstants';

const ChangePasswordRoute = React.lazy(
  () => import(/* webpackPrefetch: true */ './changePasswordRoute.component')
);
const SecurityRoute = React.lazy(
  () => import(/* webpackPrefetch: true */ './security/securityRoute.component')
);
const PlansRoute = React.lazy(
  () => import(/* webpackPrefetch: true */ './plans/plan.component')
);
const AddOnsRoute = React.lazy(
  () => import(/* webpackPrefetch: true */ './add-ons/addOns.component')
);
const AccountSettings = React.lazy(
  () => import(/* webpackPrefetch: true */ './accountSettingsRoute')
);
const DataStorage = React.lazy(
  () => import(/* webpackPrefetch: true */ './usage/usage.component')
);

export const ACCOUNT_ROUTES: {readonly [key: string]: string} = {
  ACCOUNT_SETTINGS: ROUTES.ACCOUNT_ROOT + '/settings',
  USAGE: ROUTES.ACCOUNT_ROOT + '/usage',
  SECURITY: ROUTES.ACCOUNT_ROOT + '/security',
  PLAN: ROUTES.ACCOUNT_ROOT + '/plan',
  ADD_ONS: ROUTES.ACCOUNT_ROOT + '/addons',
  CHANGE_PASSWORD: ROUTES.ACCOUNT_ROOT + '/change-password',
};

export default function routes() {
  return (
    <>
      <Route
        path=''
        element={<Navigate to={ACCOUNT_ROUTES.ACCOUNT_SETTINGS} replace />}
      />
      <Route
        path={ACCOUNT_ROUTES.SECURITY}
        element={
          <RequireAuth>
            <SecurityRoute />
          </RequireAuth>
        }
      />
      <Route
        path={ACCOUNT_ROUTES.PLAN}
        index
        element={
          <RequireAuth>
            <PlansRoute />
          </RequireAuth>
        }
      />
      <Route
        path={ACCOUNT_ROUTES.ADD_ONS}
        index
        element={
          <RequireAuth>
            <AddOnsRoute />
          </RequireAuth>
        }
      />
      <Route
        path={ACCOUNT_ROUTES.USAGE}
        index
        element={
          <RequireAuth>
            <DataStorage />
          </RequireAuth>
        }
      />
      <Route
        path={ACCOUNT_ROUTES.ACCOUNT_SETTINGS}
        element={
          <RequireAuth>
            <AccountSettings />
          </RequireAuth>
        }
      />
      <Route
        path={ACCOUNT_ROUTES.CHANGE_PASSWORD}
        element={
          <RequireAuth>
            <ChangePasswordRoute />
          </RequireAuth>
        }
      />
    </>
  );
}

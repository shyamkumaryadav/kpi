import {makeAutoObservable} from 'mobx';
import type {
  ProjectViewAsset,
  PaginatedResponse,
  FailResponse,
} from 'js/dataInterface';
import {handleApiFail} from 'js/utils';
import {ROOT_URL} from 'js/constants';
import {DEFAULT_PROJECT_FIELDS, PROJECT_FIELDS} from './projectViews/constants';
import type {
  ProjectFieldName,
  ProjectsFilterDefinition,
} from './projectViews/constants';
import {buildQueriesFromFilters} from './projectViews/utils';
import type {ProjectsTableOrder} from './projectsTable/projectsTable';
import session from 'js/stores/session';

const SAVE_DATA_NAME = 'project_views_settings';

/** Settings of a different views to be stored on backend. */
export interface ProjectViewsSettings {
  [viewUid: string]: ViewSettings;
}

interface ViewSettings {
  filters: ProjectsFilterDefinition[];
  order: ProjectsTableOrder;
  fields?: ProjectFieldName[];
}

class CustomViewStore {
  public assets: ProjectViewAsset[] = [];
  // NOTE: Both `filters` and `order` are defined via `resetSettings`.
  public filters!: ProjectsFilterDefinition[];
  public order!: ProjectsTableOrder;
  public fields?: ProjectFieldName[];
  /** Whether the first call was made. */
  public isInitialised = false;
  public isLoading = false;
  private viewUid?: string;
  /** We use `null` here because the endpoint uses it. */
  private nextPageUrl: string | null = null;

  constructor() {
    this.resetSettings();
    makeAutoObservable(this);
  }

  /** Use this whenever you need to change the view */
  public setUp(viewUid: string) {
    this.viewUid = viewUid;
    this.assets = [];
    this.isInitialised = false;
    this.isLoading = false;
    this.nextPageUrl = null;
    this.loadSettings();
  }

  /** If next page of results is available. */
  public get hasMoreAssets(): boolean {
    return this.nextPageUrl !== null;
  }

  /** Stores the new filters and fetches completely new list of assets. */
  public setFilters(filters: ProjectsFilterDefinition[]) {
    this.filters = filters;
    this.saveSettings();
    this.fetchAssets();
  }

  /** Stores the new ordering and fetches completely new list of assets. */
  public setOrder(order: ProjectsTableOrder) {
    this.order = order;
    this.saveSettings();
    this.fetchAssets();
  }

  public setFields(fields: ProjectFieldName[] | undefined) {
    this.fields = fields;
    this.saveSettings();
    // NOTE: we don't need to fetch assets again, fields are UI only
  }

  public hideField(fieldName: ProjectFieldName) {
    let newFields = Array.isArray(this.fields)
      ? Array.from(this.fields)
      : DEFAULT_PROJECT_FIELDS;
    newFields = newFields.filter((item) => item !== fieldName);
    this.setFields(newFields);
  }

  /**
   * Gets the first page of results. It will replace whatever assets are loaded
   * already.
   */
  public fetchAssets() {
    this.isInitialised = false;
    this.isLoading = true;
    this.assets = [];
    const queriesString = buildQueriesFromFilters(this.filters).join(' AND ');
    const orderingString =
      this.order.direction === 'descending'
        ? `-${this.order.fieldName}`
        : this.order.fieldName;
    $.ajax({
      dataType: 'json',
      method: 'GET',
      url: `${ROOT_URL}/api/v2/project-views/${this.viewUid}/assets/?ordering=${orderingString}&q=${queriesString}`,
    })
      .done(this.onFetchAssetsDone.bind(this))
      .fail(this.onAnyFail.bind(this));
  }

  /** Gets the next page of results (if available). */
  public fetchMoreAssets() {
    if (this.nextPageUrl !== null) {
      $.ajax({
        dataType: 'json',
        method: 'GET',
        url: this.nextPageUrl,
      })
        .done(this.onFetchMoreAssetsDone.bind(this))
        .fail(this.onAnyFail.bind(this));
    }
  }

  private onFetchAssetsDone(response: PaginatedResponse<ProjectViewAsset>) {
    this.isInitialised = true;
    this.isLoading = false;
    this.assets = response.results;
    this.nextPageUrl = response.next;
  }

  private onFetchMoreAssetsDone(response: PaginatedResponse<ProjectViewAsset>) {
    // This differs from `onFetchAssetsDone`, because it adds the Assets
    // to existing ones.
    this.isLoading = false;
    this.assets = this.assets.concat(response.results);
    this.nextPageUrl = response.next;
  }

  private onAnyFail(response: FailResponse) {
    this.isLoading = false;
    handleApiFail(response);
  }

  /**
   * Stores settings for current view in `/me/` endpoint, so user will not lose
   * the configuration of the view after leaving the route.
   */
  private saveSettings() {
    if (!this.viewUid) {
      return;
    }

    let newData: ProjectViewsSettings = {};
    // Get saved data
    if (
      'email' in session.currentAccount &&
      session.currentAccount.extra_details.project_views_settings
    ) {
      newData = session.currentAccount.extra_details.project_views_settings;
    }

    newData[this.viewUid] = {
      filters: this.filters,
      order: this.order,
      fields: this.fields,
    };

    session.setDetail(SAVE_DATA_NAME, newData);
  }

  private resetSettings() {
    // There are no initial filters
    this.filters = [];
    // Default order is by name
    this.order = {
      fieldName: PROJECT_FIELDS.name.name,
      direction: 'ascending',
    };
    // When fields are undefined, it means the deafult fields are selected.
    this.fields = undefined;
  }

  /**
   * Gets the settings for current view from session store (if they exists) with
   * fall back to defaults.
   */
  private loadSettings() {
    if (!this.viewUid) {
      return;
    }

    // First we load the default values
    this.resetSettings();

    // Then we load the saved settings (if they exist)
    if (
      'email' in session.currentAccount &&
      session.currentAccount.extra_details[SAVE_DATA_NAME] &&
      session.currentAccount.extra_details[SAVE_DATA_NAME][this.viewUid]
    ) {
      const savedViewData = session.currentAccount.extra_details[SAVE_DATA_NAME][this.viewUid];
      if (savedViewData.filters) {
        this.filters = savedViewData.filters;
      }
      if (savedViewData.order) {
        this.order = savedViewData.order;
      }
      if (savedViewData.fields) {
        this.fields = savedViewData.fields;
      }
    }
  }
}

/** Handles fetching (with filters and ordering) assets for given view. */
const customViewStore = new CustomViewStore();

export default customViewStore;

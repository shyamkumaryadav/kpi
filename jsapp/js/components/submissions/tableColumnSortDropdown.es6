import React from 'react';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import {bem} from 'js/bem';
import KoboDropdown, {KOBO_DROPDOWN_THEMES} from 'js/components/common/koboDropdown';
import {SORT_VALUES} from 'js/components/submissions/tableConstants';
import tableStore from 'js/components/submissions/tableStore';
import './tableColumnSortDropdown.scss';

const CLEAR_BUTTON_CLASS_NAME = 'table-column-sort-dropdown-clear';

/**
 * A wrapper around KoboDropdown to be used in table header to sort columns. It
 * only needs the column id as all changes are done through tableStore.
 *
 * @prop {string} fieldId - one of table columns
 * @prop {Node} [additionalTriggerContent] - to be put inside trigger, before the predefined content. Please note that the trigger as a whole is clickable, so this additional content would need stopPropagation to be clickable.
 */
class TableColumnSortDropdown extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      sortValue: null,
      isFieldHidden: false,
      isFieldFrozen: false,
    };
    this.unlisteners = [];
    autoBind(this);
  }

  componentDidMount() {
    this.unlisteners.push(
      tableStore.listen(this.onTableStoreChange)
    );
  }

  componentWillUnmount() {
    this.unlisteners.forEach((clb) => {clb();});
  }

  onTableStoreChange() {
    this.setState({
      sortValue: tableStore.getFieldSortValue(this.props.fieldId),
      isFieldHidden: tableStore.isFieldHidden(this.props.fieldId),
      isFieldFrozen: tableStore.isFieldFrozen(this.props.fieldId),
    });
  }

  renderTrigger() {
    let sortIcon = ['k-icon'];
    if (this.state.sortValue && this.state.sortValue === SORT_VALUES.A_TO_Z) {
      sortIcon.push('k-icon-sort-down');
    }
    if (this.state.sortValue && this.state.sortValue === SORT_VALUES.Z_TO_A) {
      sortIcon.push('k-icon-sort-up');
    }

    return (
      <div className='table-column-sort-dropdown-trigger'>
        {this.props.additionalTriggerContent}
        {this.state.sortValue &&
          <i className={sortIcon.join(' ')}/>
        }
        <i className='k-icon k-icon-caret-up'/>
        <i className='k-icon k-icon-caret-down'/>
      </div>
    );
  }

  clearSort() {
    tableStore.removeFieldSortValue(this.props.fieldId);
  }

  changeSort(sortValue, evt) {
    // When clicking on clear icon button, we need to avoid triggering also the
    // change sort button. We can't use `stopPropagation` on `clearSort` as it
    // breaks `onMenuClick` functionality.
    if (evt?.target?.classList?.contains(CLEAR_BUTTON_CLASS_NAME)) {
      return;
    }
    tableStore.setFieldSortValue(this.props.fieldId, sortValue);
  }

  changeFieldHidden(isHidden) {
    tableStore.setHiddenField(this.props.fieldId, isHidden);
  }

  changeFieldFrozen(isFrozen) {
    tableStore.setFrozenField(this.props.fieldId, isFrozen);
  }

  renderSortButton(buttonSortValue) {
    return (
      <bem.KoboDropdown__menuButton
        className={classNames('table-column-sort-dropdown-option', {
          'table-column-sort-dropdown-option--active': this.state.sortValue === buttonSortValue,
        })}
        onClick={this.changeSort.bind(this, buttonSortValue)}
      >
        {buttonSortValue === SORT_VALUES.A_TO_Z && [
          <i className='k-icon k-icon-sort-down'/>,
          <span>{t('Sort A → Z')}</span>,
        ]}
        {buttonSortValue === SORT_VALUES.Z_TO_A && [
          <i className='k-icon k-icon-sort-up'/>,
          <span>{t('Sort A → Z')}</span>,
        ]}

        {this.state.sortValue === buttonSortValue &&
          <i
            onClick={this.clearSort}
            className={classNames('k-icon', 'k-icon-cancel', CLEAR_BUTTON_CLASS_NAME)}
          />
        }
      </bem.KoboDropdown__menuButton>
    );
  }

  render() {
    return (
      <KoboDropdown
        theme={KOBO_DROPDOWN_THEMES.dark}
        hideOnEsc
        hideOnMenuClick
        hideOnMenuOutsideClick
        triggerContent={this.renderTrigger()}
        menuContent={
          <React.Fragment>
            {this.renderSortButton(SORT_VALUES.A_TO_Z)}
            {this.renderSortButton(SORT_VALUES.Z_TO_A)}

            <bem.KoboDropdown__menuButton
              onClick={this.changeFieldHidden.bind(this, !this.state.isFieldHidden)}
            >
              {this.state.isFieldHidden && [
                (<i className='k-icon k-icon-view'/>),
                (<span>{t('Show field')}</span>),
              ]}
              {!this.state.isFieldHidden && [
                <i className='k-icon k-icon-view-no'/>,
                <span>{t('Hide field')}</span>,
              ]}
            </bem.KoboDropdown__menuButton>

            <bem.KoboDropdown__menuButton
              onClick={this.changeFieldFrozen.bind(this, !this.state.isFieldFrozen)}
            >
              {this.state.isFieldFrozen && [
                <i className='k-icon k-icon-unfreeze'/>,
                <span>{t('Unfreeze field')}</span>,
              ]}
              {!this.state.isFieldFrozen && [
                <i className='k-icon k-icon-freeze'/>,
                <span>{t('Freeze field')}</span>,
              ]}
            </bem.KoboDropdown__menuButton>
          </React.Fragment>
        }
      />
    );
  }
}

export default TableColumnSortDropdown;

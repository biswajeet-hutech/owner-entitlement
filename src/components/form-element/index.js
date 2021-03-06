import React from "react";
import { Input, Checkbox, Popover, Tooltip } from 'antd';
import { EyeFilled } from "@ant-design/icons";

import { CheckTrue, CheckFalse, messages } from './../../assets';
import "./style.scss";
import MyStatefulEditor from "../rich-text-editor";
import Dropdown from "../dropdown";
import SearchList from "../search-list";
import SuggestiveInput from "./suggestive-input";
import WorkGroupInput from "../../containers/view-edit-entitlement/workgroupInput";
import API, { localMode } from "../../api";
import DebounceSelect from "../dropdown/search-dropdown";
import { InfoHoverIcon } from './../../assets';

const { TextArea } = Input;

const InputForm = ({ value, readOnly, onChange, maxLength, ...otherProps }) => {

  const showCount = (
    <div style={{ textAlign: 'right' }}>
      {`${value?.length || 0} / ${maxLength}`}
    </div>
  )
  return (
    <>
      {
        readOnly ? <span>{ value?value:'' }</span> : (
          <>
            <Input
              defaultValue={value}
              value={value}
              className={`oe-form-input ${otherProps.error && 'oe-form-error'}`}
              onChange={(e) => onChange(e.target.value)}
              {...otherProps}
            />
            <div className="flex-space form-footer-container">
              { otherProps.error ? <div className="oe-form-error-text">{otherProps.error}</div> : <div/> }
              { maxLength && showCount }
            </div>
          </>
        )
      }
    </>
  )
}

const DescriptionForm = ({value, readOnly, onChange, ...otherProps }) => {
  const handleOnChange = (txt='') => {
    const newValue = txt?.replace(/^\<p\>/,"").replace(/\<\/p\>$/,"") || "";
    onChange(newValue);
  }
  return (
    <>
      {
        readOnly ? <div dangerouslySetInnerHTML={{__html: value}} /> : (
          <>
            <MyStatefulEditor value={value || ''} onChange={handleOnChange} {...otherProps} />
          </>
        )
      }
    </>
  )
}

const TextAreaForm = ({value, readOnly, onChange, maxLength, hideCount, rows=10, ...otherProps }) => {
  const showCount = (
    <div style={{ textAlign: 'right' }}>
      {`${value?.length || 0} / ${maxLength}`}
    </div>
  )
  return (
    <>
      {
        readOnly ? <div dangerouslySetInnerHTML={{__html: value}} /> : (
          <>
            <TextArea
              maxLength={maxLength}
              value={value}
              rows={rows}
              onChange={(e) => onChange(e.target.value)}
              autoSize={true}
              className={`${otherProps.error && 'oe-form-error'}`}
              {...otherProps}
            />
             <div className="flex-space form-footer-container">
              { otherProps.error ? <div className="oe-form-error-text">{otherProps.error}</div> : <div/> }
              { maxLength && showCount }
            </div>
          </>
        )
      }
      
    </>
  )
}

const CheckboxForm = ({value, readOnly, onChange, ...otherProps}) => {
  const isChecked = typeof value === "boolean" ? !!value : ["true", "yes"].includes((value+'').toLowerCase());
  const isUnchecked = typeof value === "boolean" ? !value : ["no", "false"].includes((value+'').toLowerCase());
  return (
    <>
      {
        readOnly ? (isChecked ? (
        <CheckTrue
          className="checkIcon"
          style={{
            fontSize: 16
          }}
        />
        ) : (isUnchecked) ? (
        <CheckFalse
          className="checkIcon"
          style={{
            fontSize: 16
          }}
        />) : value) : (
          <Checkbox
            checked={!!isChecked}
            onChange={(e) => onChange(e.target.checked+'')}
            {...otherProps}
          />
          )
      }
    </>
  )
}

const DropdownForm = ({options, readOnly, onChange, value, ...otherProps}) => {
  return (
    <>
      {
        readOnly ? <span>{ value?value:'' }</span> : (
        <>
          <Dropdown
            options={options}
            value={value}
            onChange={onChange}
            overrideClass={`oe-form-dropdown ${otherProps.error && 'oe-form-error'}`}
            {...otherProps}
          />
          <div className="form-footer-container">
            { otherProps.error && <div className="oe-form-error-text">{otherProps.error}</div> }
          </div>
        </>
        )
      }
    </>
  )
}

const ChipDropdownForm = ({options, readOnly, onChange, value, isWorkgroup, dataObject, optionFilterProp, ...otherProps }) => {
  const [workgroupMembers, setWorkgroupMembers] = React.useState([]);
  const [originalWorkgroupMembers, setOriginalWorkgroupMembers] = React.useState([]);
  const [loadingWorkgroupMembers, setLoadingWorkgroupMembers] = React.useState(false);
  
  const [viewPopVisible, setViewPopVisible] = React.useState({});

  const getWorkgroupMembers = (workgroupId) => {
    if (workgroupId) {
      setLoadingWorkgroupMembers(true);
      API.post('/EntitlementManagement/workgroup/details', {
        "id": workgroupId
      }).then(response => {
        if (Array.isArray(response.data)) {
          const output = [...response.data].map(item => ({
            label: item.displayName || (item.firstname ? `${item.firstname} ${item.lastname}` : item.name),
            id: item.name,
            searchString: `${item.displayName || ''} ${item.firstname || ''} ${item.lastname || ''} ${item.name || ''}`
          }))
          setWorkgroupMembers(stateData => output);
          setOriginalWorkgroupMembers(stateData => output);
        }
      }).catch(err => {
        if (localMode) {
          import("../../data/workgroup-members.json").then(res => {
            const result = [...res.default].map(item => ({
              label: item.displayName || (item.firstname ? `${item.firstname} ${item.lastname}` : item.name),
              id: item.name,
              searchString: `${item.displayName || ''} ${item.firstname || ''} ${item.lastname || ''} ${item.name || ''}`
            }));
            setWorkgroupMembers(stateData => result);
            setOriginalWorkgroupMembers(stateData => result);
          })
        }
      }).finally(res => {
        setLoadingWorkgroupMembers(false);
      })
    }
  }

  const handleViewVisibleChange = (v, index) => {
    if (v) {
      getWorkgroupMembers(index);
    }
    setViewPopVisible({
      ...viewPopVisible,
      [index]: v
    });
  }

  const filterSearch = (searchText) => {
    const filteredList = originalWorkgroupMembers.filter(item => ((item.searchString || '').toLowerCase()).includes(searchText.toLowerCase()));
    setWorkgroupMembers(filteredList);
  }

  return (
    <>
      {
        readOnly ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{ value || '' }</span>
            { isWorkgroup ? (
              <Popover
                content={
                <SearchList
                list={[...workgroupMembers]}
                labelProp="label"
                action="view"
                onItemAdd={() => {}}
                onItemRemove={() => {}}
                loadingList={loadingWorkgroupMembers}
                onSearch={filterSearch}
                />}
                title=""
                trigger="click"
                visible={viewPopVisible[dataObject?.id]}
                destroyTooltipOnHide
                onVisibleChange={(v) => handleViewVisibleChange(v, dataObject?.id)}
              >
                <Tooltip title="View Members" placement="bottom">
                  <p style={{ margin: '0px 8px', display: 'flex', cursor: 'pointer' }} onClick={e => e.stopPropagation()}>
                    <EyeFilled style={{ color: '#666', fontSize: 16}} />
                  </p>
                </Tooltip>
              </Popover>
            ) : null}
          </div>
        ): (
        <>
          <DebounceSelect
            value={value}
            onChange={onChange}
            overrideClass={`oe-form-dropdown ${otherProps.error && 'oe-form-error'}`}
            dataObject={dataObject}
            {...otherProps}
          />
          <div className="form-footer-container">
            { otherProps.error && <div className="oe-form-error-text">{otherProps.error}</div> }
            { value?.length > 1 && (<div style={{ margin: '4px 0 0' }}>{messages.WORKGROUP.HELPER_TXT}</div> )}
          </div>
        </>
        )
      }
    </>
  )
}

const FormElement = ({
  label,
  required,
  ...props
}) => {
  const renderFormItem = ({
    type,
    ...otherProps
  }) => {
    switch(type) {
      case 'input':
        return <InputForm {...otherProps} />;
      case 'textarea':
        return <TextAreaForm {...otherProps} />;
      case 'description':
        return <DescriptionForm {...otherProps} />;
      case 'checkbox':
        return <CheckboxForm {...otherProps} />;
      case 'dropdown':
      // case 'object':
        return <DropdownForm {...otherProps} />;
      case 'workgroup':
        return <WorkGroupInput {...otherProps} />
      case 'search-dropdown':
        return <ChipDropdownForm {...otherProps} />
      case 'suggestiveInput':
        return <SuggestiveInput {...otherProps} />
      default:
        return otherProps.value;
    }
  }
  return (
    <div className="oe-form-wrapper" style={{ flexDirection: props.fullWidth ? 'column' : 'row', alignItems: (props.type === "checkbox" || props.readOnly) ? "center" : "flex-start"}}>
      <div className="oe-form-label" style={{ marginBottom: props.fullWidth ? '8px' : '0' }}>
        {
          label
          
        }
        {
          !props.readOnly && <span className="oe-astreak">{`${required ? '*' : ''}`}</span>
        }
        {   
          props.needHelp ==='YES' ? 
          <Tooltip title={messages.DISPUTE_HELP} placement="bottom" onClick={() => window.open("https://www.google.com/","_blank")}>
            <span className="oe-icon-btn">
              <InfoHoverIcon className="hover" width={20} height={17}/>
            </span>
          </Tooltip> : ''
        }
      </div>
      <div className="oe-form-value">
        {
          renderFormItem(props)
        }
      </div>
    </div>
  );
}

export default FormElement;

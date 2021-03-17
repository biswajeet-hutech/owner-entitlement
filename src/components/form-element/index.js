import React from "react";
import { Input, Checkbox, Popover, Tooltip } from 'antd';
import { EyeFilled } from "@ant-design/icons";

import { CheckTrue, CheckFalse, messages } from './../../assets';
import "./style.scss";
import MyStatefulEditor from "../rich-text-editor";
import Dropdown from "../dropdown";
import ChipSelect from "../chip-select";
import SearchList from "../search-list";
import WorkGroupInput from "../../containers/entitlement-details/workgroupInput";
import API, { localMode } from "../../api";
import dummyWorkgroupMembers from "../../data/workgroup-members.json";

const { TextArea } = Input;

const InputForm = ({ value, readOnly, onChange, ...otherProps }) => {
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
            { otherProps.error && <div className="oe-form-error-text">{otherProps.error}</div> }
          </>
        )
      }
    </>
  )
}

const DescriptionForm = ({value, readOnly, onChange, ...otherProps }) => {
  const handleOnChange = (value='') => {
    const newValue = value?.replace(/^\<p\>/,"").replace(/\<\/p\>$/,"") || "";
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
  return (
    <>
      {
        readOnly ? <div dangerouslySetInnerHTML={{__html: value}} /> : (
          <>
          <TextArea
            showCount={!hideCount}
            maxLength={maxLength}
            value={value}
            rows={rows}
            onChange={(e) => onChange(e.target.value)}
            {...otherProps}
          />
          { otherProps.error && <div className="oe-form-error-text">{otherProps.error}</div> }
          </>
        )
      }
    </>
  )
}

const CheckboxForm = ({value, readOnly, onChange, ...otherProps}) => {
  return (
    <>
      {
        readOnly ? (value ? (
        <CheckTrue
          className="checkIcon"
          style={{
            fontSize: 16
          }}
        />
        ) : (
        <CheckFalse
          className="checkIcon"
          style={{
            fontSize: 16
          }}
        />
        )) : (
          <Checkbox
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
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
          { otherProps.error && <div className="oe-form-error-text">{otherProps.error}</div> }
        </>
        )
      }
    </>
  )
}

const ChipDropdownForm = ({options, readOnly, onChange, value, isWorkgroup, ...otherProps}) => {
  const [workgroupMembers, setWorkgroupMembers] = React.useState([]);
  const [loadingWorkgroupMembers, setLoadingWorkgroupMembers] = React.useState(false);
  const workgroupMembersDropList = workgroupMembers.map(item => ({
    label: item.firstname ? `${item.firstname} ${item.lastname}` : item.name,
    id: item.name
  }));
  const [viewPopVisible, setViewPopVisible] = React.useState({});

  const getWorkgroupMembers = (workgroupName) => {
    setLoadingWorkgroupMembers(true);
    API.post('/EntitlementManagement/workgroup/details', {
      "name": workgroupName
    }).then(response => {
      if (Array.isArray(response.data)) {
        setWorkgroupMembers(stateData => [...response.data]);
      }
    }).catch(err => {
      if (localMode) {
        const result = []
        setWorkgroupMembers(stateData => [
          ...dummyWorkgroupMembers,
          ...result
        ]);
      }
    }).finally(res => {
      setLoadingWorkgroupMembers(false);
    })
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
                list={[...workgroupMembersDropList]}
                labelProp="label"
                action="view"
                onItemAdd={() => {}}
                onItemRemove={() => {}}
                loadingList={loadingWorkgroupMembers}
                />}
                title=""
                trigger="click"
                visible={viewPopVisible[value]}
                destroyTooltipOnHide
                onVisibleChange={(v) => handleViewVisibleChange(v, value)}
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
          <ChipSelect
            options={options}
            value={value}
            onChange={onChange}
            overrideClass={`oe-form-dropdown ${otherProps.error && 'oe-form-error'}`}
            {...otherProps}
          />
          { otherProps.error && <div className="oe-form-error-text">{otherProps.error}</div> }
          { value?.length > 1 && (<div style={{ margin: '4px 0 0' }}>{messages.WORKGROUP.HELPER_TXT}</div> )}
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
      case 'chip_dropdown':
        return <ChipDropdownForm {...otherProps} />;
      case 'workgroup':
        return <WorkGroupInput {...otherProps} />
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

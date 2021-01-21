import React from "react";
import {CheckTrue,CheckFalse} from './../../assets';
import { Input, Checkbox } from 'antd';
import "./style.scss";
import MyStatefulEditor from "../rich-text-editor";
import Dropdown from "../dropdown";
const { TextArea } = Input;

const InputForm = ({ value, readOnly, onChange, ...otherProps }) => {
  return (
    <>
      {
        readOnly ? <span>{ value?value:'—' }</span> : (
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
  return (
    <>
      {
        readOnly ? <div dangerouslySetInnerHTML={{__html: value}} /> : (
          <>
            <MyStatefulEditor value={value || ''} onChange={onChange} {...otherProps} />
          </>
        )
      }
    </>
  )
}

const TextAreaForm = ({value, readOnly, onChange,maxLength, ...otherProps }) => {
  return (
    <>
      {
        readOnly ? <div dangerouslySetInnerHTML={{__html: value}} /> : (
          <>
          <TextArea
            showCount
            maxLength={maxLength}
            value={value}
            rows={10}
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
        readOnly ? <span>{ value?value:'—' }</span> : (
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
        return <DropdownForm {...otherProps} />;
      default:
        return otherProps.value || '—';
    }
  }
  return (
    <div className="oe-form-wrapper" style={{ flexDirection: props.fullWidth ? 'column' : 'row', alignItems: props.type === "checkbox" ? "center" : "flex-start"}}>
      <div className="oe-form-label" style={{ marginBottom: props.fullWidth ? '8px' : '0' }}>
        { label }<span className="oe-astreak">{`${required ? '*' : ''}`}</span>
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

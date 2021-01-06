import React from "react";
import { CheckCircleFilled, StopOutlined } from '@ant-design/icons';
import { Input, Checkbox } from 'antd';
import "./style.scss";
import Dropdown from "../dropdown";
const { TextArea } = Input;

const InputForm = ({value, readOnly}) => {
  return (
    <>
      {
        readOnly ? <span>{ value }</span> : (
          <Input defaultValue={value} />
        )
      }
    </>
  )
}

const DescriptionForm = ({value, readOnly, onChange, ...otherProps }) => {
  return (
    <>
      {
        readOnly ? <span>{ value }</span> : (
          <>
          <TextArea showCount maxLength={2000} value={value} rows={10} onChange={onChange} {...otherProps} />
          { otherProps.error && <div className="oe-form-error">{otherProps.error}</div> }
          </>
        )
      }
    </>
  )
}

const CheckboxForm = ({value, readOnly}) => {
  return (
    <>
      {
        readOnly ? (value ? <CheckCircleFilled style={{ fontSize: 16, color: '#37ae22' }} /> : <StopOutlined style={{ fontSize: 16, color: '#c1c1c1' }} />) : (
          <Checkbox checked={!!value} />
        )
      }
    </>
  )
}

const DropdownForm = ({value, readOnly}) => {
  return (
    <>
      {
        <Dropdown options={value} onChange={(v, e) => console.log(v, e)} />
      }
    </>
  )
}

const FormElement = ({
  label,
  ...props
}) => {
  const renderFormItem = ({
    type,
    ...otherProps
  }) => {
    switch(type) {
      case 'input':
        return <InputForm {...otherProps} />;
      case 'description':
        return <DescriptionForm {...otherProps} />;
      case 'checkbox':
        return <CheckboxForm {...otherProps} />;
      case 'dropdown':
        return <DropdownForm {...otherProps} />;
      default:
        return otherProps.value;
    }
  }
  return (
    <div className="oe-form-wrapper" style={{ flexDirection: props.fullWidth ? 'column' : 'row', alignItems: props.type === "description" ? "flex-start" : "center" }}>
      <div className="oe-form-label" style={{ marginBottom: props.fullWidth ? '8px' : '0' }}>
        { label }
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

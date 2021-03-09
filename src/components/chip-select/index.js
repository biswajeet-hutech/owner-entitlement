import React from "react";
import { Select, Tag } from 'antd';
import { CaretDownFilled } from '@ant-design/icons';
import {strings} from './../../assets';

const { Option } = Select;

const ChipSelect = ({
  label,
  options = [],
  placeholder=strings.default_dropdown_placeholder,
  selectedValue,
  onChange,
  overrideClass="",
  disabled,
  onBlur,
  value,
  renderOptions
}) => {
  function tagRender(props) {
    const { label, value, closable, onClose } = props;
  
    return (
      <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }} onClick={(e) => {console.log('tag clicked'); e.stopPropagation()}}>
        {label}
      </Tag>
    );
  }
  return (
  <div className={`oe-dropdown-container ${overrideClass}`}>
    {label?<div className="oe-form-label">
        { label+" :" }
      </div>:null}
    <Select
      mode="multiple"
      showArrow
      tagRender={tagRender}
      style={{width: '100%'}}
      suffixIcon={<CaretDownFilled style={{ fontSize: 16 }} />}
      defaultValue={selectedValue}
      className="oe-dropdown"
      placeholder={placeholder}
      onChange={onChange}
      disabled={!!disabled}
      value={value}
      optionFilterProp="label"
      onBlur={onBlur}
    >
      {
        renderOptions || options.map(option => (
          <Option value={option.value}>
            {
              option.bold ? <b>{option.label}</b> : option.label
            }
          </Option>
        ))
      }
    </Select>
  </div>
  )
}

export default ChipSelect;

import React from "react";
import { Select } from 'antd';
import { CaretDownFilled } from '@ant-design/icons';
import "./style.scss";
import {strings} from './../../assets';

const { Option } = Select;

const Dropdown = ({
  label,
  options = [],
  placeholder=strings.default_dropdown_placeholder,
  selectedValue,
  onChange,
  overrideClass="",
  disabled,
  value
}) => (
  <div className={`oe-dropdown-container ${overrideClass}`}>
    {label?<div className="oe-form-label">
        { label }
      </div>:null}
    <Select
      suffixIcon={<CaretDownFilled
      style={{ fontSize: 16 }} />}
      defaultValue={selectedValue}
      className="oe-dropdown"
      placeholder={placeholder}
      onChange={onChange}
      disabled={!!disabled}
      value={value}
      allowClear={true}
    >
      {
        options.map(option => (
          <Option value={option.value}>{option.label}</Option>
        ))
      }
    </Select>
  </div>
)

export default Dropdown;

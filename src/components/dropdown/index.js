import React from "react";
import { Select } from 'antd';
import { CaretDownFilled } from '@ant-design/icons';
import "./style.scss";
const { Option } = Select;

const Dropdown = ({
  label,
  options = [],
  placeholder="Select a value",
  selectedValue,
  onChange,
  overrideClass="",
  disabled,
  value
}) => (
  <div className={`oe-dropdown-container ${overrideClass}`}>
    <div className="oe-form-label">
        { label }
      </div>
    <Select
      suffixIcon={<CaretDownFilled
      style={{ fontSize: 16 }} />}
      defaultValue={selectedValue}
      className="oe-dropdown"
      placeholder={placeholder}
      onChange={onChange}
      disabled={!!disabled}
      value={value}
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

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
  onChange
}) => (
  <div className="oe-dropdown-container">
    <label className="oe-label">{label}</label>
    <Select
      suffixIcon={<CaretDownFilled
      style={{ fontSize: 16 }} />}
      defaultValue={selectedValue}
      className="oe-dropdown"
      placeholder={placeholder}
      onChange={onChange}
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

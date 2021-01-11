import React from "react";
import { Form, Row, Col, message, Input, DatePicker } from 'antd';
import Button from '../../components/button';
import "./style.scss";
import Typography from "../../components/typography";
import Dropdown from "../../components/dropdown";
import API from "../../api";

const dropdownOptions = [
  {
    label: 'Application 1',
    value: 'app1'
  },
  {
    label: 'Application 2',
    value: 'app2'
  },
  {
    label: 'Application 3',
    value: 'app3'
  },
  {
    label: 'Application 4',
    value: 'app4'
  }
]

const constructDropdown = (data = []) => {
  const result = Array.isArray(data) && data.map(item => ({
    label: item,
    value: item
  }));

  return result;
}

const ExtendedAttributes = ({
  data={},
  updateFormData=()=>{},
  selectedValues={}
}) => {
  const getDataFromAPI = () => {

  }
  
  const renderContent = () => {
    const { type, allowedValues, APIName, displayName, extendedAttrName } = data;
    switch(type) {
      case 'string':
        if (allowedValues === null) {
          return (
            <Form.Item label={displayName}>
              <Input value={selectedValues[extendedAttrName]} onChange={(e) => updateFormData(extendedAttrName, e.target.value)} className="oe-adv-search-input" />
            </Form.Item>
          );
        } else  {
          return <Dropdown value={selectedValues[extendedAttrName]} options={constructDropdown(allowedValues)} onChange={(v, e) => updateFormData(extendedAttrName, v)} label={displayName} />;
        }
      case 'date':
        return (
          <Form.Item label={displayName}>
            <DatePicker value={selectedValues[extendedAttrName]} onChange={(d, ds) => updateFormData(extendedAttrName, ds)} className="oe-adv-search-datepicker" />
          </Form.Item>
        );
      case 'int':
        return (
          <Form.Item label={displayName}>
            <Input value={selectedValues[extendedAttrName]} onChange={(e) => updateFormData(extendedAttrName, e.target.value)} className="oe-adv-search-input" />
          </Form.Item>
        )
      case 'boolean':
        return <Dropdown value={selectedValues[extendedAttrName]} options={constructDropdown(['True', 'False'])} onChange={(v, e) => updateFormData(extendedAttrName, v)} label={displayName} />;;
      // case 'sailpoint.object.Identity':
      //   getDataFromAPI(APIName);
      //   return;
      // case 'sailpoint.object.Rule':
      //   getDataFromAPI(APIName);
      //   return;
      default:
        return null;
    }
  }

  return (
    <Col md={12} style={{ margin: '4px 0' }}>
      {
        renderContent()
      }
    </Col>
  )
}

export default ExtendedAttributes;
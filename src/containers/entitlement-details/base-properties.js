import React from "react";
import { Row } from "antd";
import Button from "../../components/button";
import './style.scss';
import FormElement from "../../components/form-element";
import ExtendedProperties from "./extended-properties";

const BaseProperties = ({
  data={
    EntitlementDetails: {},
    ExtentedAttributeProperties: []
  },
  readOnly,
  setActions=(ele)=>{},
  onSave=()=>{},
  onCancel=()=>{}
}) => {
  const [entitlementData, setEntitlementData] = React.useState(data.EntitlementDetails || {});
  const [formData, setFormData] = React.useState({});
  const readOnlyProperties = ['application', 'value', 'lastrefresh', 'modified'];

  const handleUpdate = (key, value) => {
    // console.log('updatefff');
    setFormData({ ...formData, [key]: value });
    setEntitlementData({ ...entitlementData, [key]: value });
  }

  const readOnlyFormConfig = [
    {
      key: 'application',
      label: 'Application',
      value: entitlementData.application,
      type: 'input',
      readOnly: true
    },
    {
      key: 'value',
      label: 'Value',
      value: entitlementData.value,
      type: 'input',
      readOnly: true
    },
    {
      key: 'lastrefresh',
      label: 'Last Refreshed',
      value: entitlementData.lastrefresh,
      type: 'input',
      readOnly: true
    },
    {
      key: 'modified',
      label: 'Last Modified',
      value: entitlementData.modified,
      type: 'input',
      readOnly: true
    },
  ]

  const writableFormConfig = [
    {
      key: 'displayName',
      label: 'Display Value',
      type: 'input',
      maxLength: 100,
      value: entitlementData.displayName,
      readOnly,
      onChange: (value) => handleUpdate('displayName', value)
    },
    {
      key: 'requestable',
      label: 'Requestable',
      value: entitlementData.requestable === "true",
      type: 'checkbox',
      readOnly,
      onChange: (value) => handleUpdate('requestable', value+'')
    },
    {
      key: 'description',
      label: 'Description',
      value: data.EntitlementDetails.description,
      defaultValue: data.EntitlementDetails.description,
      type: 'description',
      readOnly,
      onChange: (value) => handleUpdate('description', value)
    }
  ]

  const handleSaveData = () => {
    const payload = {};
    for (const key in formData) {
      if(!readOnlyProperties.includes(key)) {
        payload[key] = formData[key];
      }
    }

    onSave(payload);
  }

  React.useEffect(() => {
    // console.log("data updated", data.EntitlementDetails);
    setEntitlementData(data.EntitlementDetails || {});
    if(!readOnly){
      setActions(
        (
          <>
        <Row justify="end" className="accordion_footer">
          <Button type="secondary" size="large" className="cancel" onClick={onCancel}>Cancel</Button>
          <Button type="primary" size="large" className="save" onClick={handleSaveData}>Save</Button>
        </Row>
        </>
        )
      )
    }
  }, [data]);

  return (
    <>
      <div className="form-section form-section-readonly">
      {
        readOnlyFormConfig.map(formElement => <FormElement {...formElement} />)
      } 
      </div>
      <div className="form-section form-section-writable">
      {
        writableFormConfig.map(formElement => <FormElement {...formElement} />)
      }
      </div>
      <ExtendedProperties
        entitlementData={entitlementData}
        extendedProps={data.ExtentedAttributeProperties}
        readOnly={readOnly}
        onChange={handleUpdate}
      />  
    </>
  );
}

export default BaseProperties;

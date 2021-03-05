import React from "react";
import { Row } from "antd";
import { getFormType } from "../../utils";
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
  const [errors, setErrors] = React.useState({});
  const readOnlyProperties = ['application', 'value', 'lastrefresh', 'modified'];
  const requiredCommonAttributes = ["displayName", "description"];
  const requiredExtendedAttributes = Array.isArray(data.ExtentedAttributeProperties) ? data.ExtentedAttributeProperties.map(item => item.name).filter(item => !['approver_level2', 'approver_level3'].includes(item)) : [];
  // const requiredProps = [...requiredCommonAttributes, ...requiredExtendedAttributes];
  const requiredProps = [];
  if (entitlementData.approval_levels > "1") {
    requiredProps.push("approver_level2");
  }
  if (entitlementData.approval_levels > "2") {
    requiredProps.push("approver_level3")
  }
  const handleUpdate = (key, value) => {
    // console.log('updatefff');
    // console.log(value);
    const updatedObj = {
      [key]: value
    }

    if (key === 'approval_levels' && value === '1') {
      updatedObj.approver_level2 = null;
      updatedObj.approver_level3 = null;
    }

    setFormData({ ...formData, ...updatedObj });
    setEntitlementData({ ...entitlementData, ...updatedObj });
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
  ];

  const userActionSectionData = [
    {
      key: 'lastrefresh',
      label: 'Refreshed On',
      value: entitlementData.lastrefresh,
      type: 'input',
      readOnly: true
    },
    {
      key: 'modified',
      label: 'Updated On',
      value: entitlementData.modified,
      type: 'input',
      readOnly: true
    },
  ]

  const writableFormConfig = [
    {
      key: 'displayName',
      label: 'Display Value',
      type: 'textarea',
      maxLength: 450,
      // hideCount: true,
      value: entitlementData.displayName,
      readOnly,
      rows: 1,
      // required: true,
      error: errors.displayName,
      onChange: (value) => handleUpdate('displayName', value)
    },
    {
      key: 'requestable',
      label: 'Requestable',
      value: entitlementData.requestable === "true",
      type: 'checkbox',
      readOnly,
      // required: true,
      onChange: (value) => handleUpdate('requestable', value+'')
    },
    {
      key: 'description',
      label: 'Description',
      value: data.EntitlementDetails.description,
      defaultValue: data.EntitlementDetails.description,
      type: 'description',
      // required: true,
      error: errors.description,
      readOnly,
      onChange: (value) => handleUpdate('description', value)
    }
  ]

  const handleSaveData = () => {
    const errors = {};
    requiredProps.forEach(item => {
      if (!entitlementData[item]) {
        errors[item] = "This field is required";
      }
    })

    const inValidForm = Object.keys(errors).length;
    setErrors(errors);
    if (inValidForm) {
      return;
    } else {
      const payload = {};
      for (const key in formData) {
        if(!readOnlyProperties.includes(key)) {
          payload[key] = formData[key];
        }
      }
      onSave(payload);
    }
  }

  React.useEffect(() => {
    // console.log("data updated", data.EntitlementDetails);
    setEntitlementData(data.EntitlementDetails || {});
    if(!readOnly) {
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
        errors={errors}
      />
      <div className="form-section form-section-readonly form-top-border">
        {
          userActionSectionData.map(formElement => <FormElement {...formElement} />)
        } 
      </div>
      {
        !readOnly && (
        <>
          <Row justify="end" className="accordion_footer">
            <Button type="secondary" size="large" className="cancel" onClick={onCancel}>Cancel</Button>
            <Button type="primary" size="large" className="save" onClick={handleSaveData}>Save</Button>
          </Row>
        </>
        )
      }
    </>
  );
}

export default BaseProperties;

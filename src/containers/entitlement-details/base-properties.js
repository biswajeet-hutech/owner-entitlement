import React from "react";
import { Row, Spin } from "antd";
// import { getFormType } from "../../utils";
import Button from "../../components/button";
import './style.scss';
import FormElement from "../../components/form-element";
import ExtendedProperties from "./extended-properties";
import { messages } from "../../assets";

const BaseProperties = ({
  data={
    EntitlementDetails: {},
    ExtentedAttributeProperties: []
  },
  standardAttributes = [],
  readOnly,
  setActions=(ele)=>{},
  onSave=()=>{},
  onCancel=()=>{}
}) => {
  const [entitlementData, setEntitlementData] = React.useState(data.EntitlementDetails || {});
  const [formData, setFormData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const readOnlyProperties = ['application', 'value', 'lastrefresh', 'modified'];
  const requiredProps = [];

  const handleUpdate = (key, value) => {
    const updatedObj = {
      [key]: value
    }

    if (key === 'approvalLevels') {
      if (!value || value === '1') {
        updatedObj.approverLevel2 = null;
        updatedObj.approverLevel3 = null;
      }
      if (value === '2') {
        updatedObj.approverLevel3 = null;
      }
    }

    setFormData(stateData => ({
      ...stateData,
      ...updatedObj
    }));

    setEntitlementData(stateData => ({
      ...stateData,
      ...updatedObj
    }));
  }

  const getErrors = (formData) => {
    const errorObj = {};
    requiredProps.forEach(item => {
      if (!entitlementData[item]) {
        errorObj[item] = messages.FORM.REQUIRED;
      }
    })

    const approverKeys = [];
    if (entitlementData.approvalLevels > "1") {
      approverKeys.push("approverLevel2");
    }
    if (entitlementData.approvalLevels > "2") {
      approverKeys.push("approverLevel3")
    }

    approverKeys.forEach(item => {
      if (!formData[item]) {
        errorObj[item] = messages.FORM.REQUIRED;
      } else if (Array.isArray(formData[item]) && formData[item]?.length > 1) {
        errorObj[item] = messages.FORM.SELECT_WORKGROUP;
      } else if (Array.isArray(formData[item]) && !formData[item].length) {
        errorObj[item] = messages.FORM.SELECT_APPROVER;
      }
    })

    return errorObj;
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

  const getStandardFormConfig = {
    displayName: {
      type: 'textarea',
      maxLength: 450,
      rows: 1
    },
    requestable: {
      type: 'checkbox'
    },
    description: {
      type: 'description'
    }
  }

  const standardFormConfig = standardAttributes.map(attr => ({
    ...getStandardFormConfig[attr.name],
    key: attr.name,
    label: attr.displayName,
    type: getStandardFormConfig[attr.name]?.type || attr.type,
    value: entitlementData[attr.name],
    readOnly: readOnly || attr.readOnly,
    onChange: (value) => handleUpdate(attr.name, value),
    error: errors[attr.name]
  }))

  const handleSaveData = () => {
    const finalFormData = {...formData};
    const errors = getErrors(finalFormData);
    const inValidForm = Object.keys(errors).length;
    setErrors(errors);

    if (inValidForm) {
      return;
    } else {
      const payload = {};
      for (const key in finalFormData) {
        if(!readOnlyProperties.includes(key)) {
          if (["approverLevel2", "approverLevel3"].includes(key) && Array.isArray(finalFormData[key])) {
            payload[key] = finalFormData[key].join();
          } else {
            payload[key] = finalFormData[key];
          }
        }
      }
      onSave(payload);
    }
  }

  React.useEffect(() => {
    const errorObj = getErrors({ ...formData });
    setErrors(stateData => errorObj);
  }, [formData]);

  React.useEffect(() => {
    setEntitlementData(data.EntitlementDetails || {});
    if(!readOnly) {
      setActions(
        (
          <>
            <Row justify="end" className="accordion_footer">
              <Button type="secondary" size="large" className="cancel" onClick={onCancel}>{messages.CANCEL_BTN}</Button>
              <Button type="primary" size="large" className="save" onClick={handleSaveData}>{messages.SAVE}</Button>
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
        standardFormConfig.map(formElement => <FormElement {...formElement} />)
      }
      </div>
      <ExtendedProperties
        originalData={data.EntitlementDetails}
        entitlementData={entitlementData}
        extendedProps={data.ExtentedAttributeProperties}
        readOnly={readOnly}
        onChange={handleUpdate}
        errors={errors}
        onEntityLoad={(flag) => setLoading(!!flag)}
      />
      <div className="form-section form-section-readonly form-top-border">
        {
          userActionSectionData.map(formElement => <FormElement {...formElement} />)
        } 
      </div>
      {
        !readOnly && (
        <Spin spinning={!!loading}>
          <Row justify="end" className="accordion_footer">
            <Button type="secondary" size="large" className="cancel" onClick={onCancel}>{messages.CANCEL_BTN}</Button>
            <Button type="primary" size="large" className="save" onClick={handleSaveData}>{messages.SAVE}</Button>
          </Row>
        </Spin>
        )
      }
    </>
  );
}

export default BaseProperties;

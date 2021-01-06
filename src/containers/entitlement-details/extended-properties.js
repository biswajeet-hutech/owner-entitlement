import React from "react";

import './style.scss';
import FormElement from "../../components/form-element";

const ExtendedProperties = ({
  entitlementData={},
  readOnly
}) => {
  const extendedProps = entitlementData.ExtentedAttributeProperties || [];
  const entitlement = entitlementData.EntitlementDetails || {};
  console.log(entitlementData);
  const getFormType = (prop) => {
    switch (prop.type) {
      case "string":
        if (prop.allowedValues !== null) {
          return "dropdown";
        }
        return "input";
      case "date":
        return "datepicker";
      case "int":
        return "input";
      case "boolean":
        return "checkbox";
      case "sailpoint.object.Identity":
        return "sailpoint.object.Identity";
      default:
        return prop.type;
    }
  };

  const readOnlyFormConfig = [
    {
      key: 'application',
      label: 'Application',
      value: extendedProps.application,
      type: 'input',
      readOnly: true
    },
    {
      key: 'type',
      label: 'Type',
      value: extendedProps.type,
      type: 'input',
      readOnly: true
    },
    {
      key: 'attribute',
      label: 'Attribute',
      value: extendedProps.attribute,
      type: 'input',
      readOnly: true
    },
    {
      key: 'value',
      label: 'Value',
      value: extendedProps.value,
      type: 'input',
      readOnly: true
    },
    {
      key: 'lastRefreshed',
      label: 'Last Refreshed',
      value: extendedProps.lastrefresh,
      type: 'input',
      readOnly: true
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
      value: extendedProps.modified,
      type: 'input',
      readOnly: true
    },
  ]

  const formGroupData = Array.isArray(extendedProps) ? extendedProps.map(props => {
    const formType = getFormType(props);
    const formValue = formType === "dropdown" ? (Array.isArray(props.allowedValues) && props.allowedValues.map(item => ({ label: item, value: item }))) : entitlement[props.name];
    return {
      key: props.name,
      label: props.displayName,
      value: formValue,
      type: formType
    }
  }) : [];

  return (
    <>
    <div className="form-section extended-property-section">
      <div className="extended-property-label">Extended Properties</div>
      {
        formGroupData.map(formElement => <FormElement {...formElement} readOnly={readOnly} />)
      } 
    </div>
    </>
  );
}

export default ExtendedProperties;

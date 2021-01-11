import React from "react";

import './style.scss';
import FormElement from "../../components/form-element";

const ExtendedProperties = ({
  entitlementData={},
  extendedProps=[],
  readOnly,
  onChange
}) => {
  // console.log(entitlementData);
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

  const formGroupData = Array.isArray(extendedProps) ? extendedProps.map(props => {
    const formType = getFormType(props);
    const formValue = entitlementData[props.name];
    return {
      key: props.name,
      label: props.displayName,
      value: formValue,
      type: formType,
      maxLength: formType === 'input' ? 100 : null,
      options: formType === "dropdown" ? (Array.isArray(props.allowedValues) && props.allowedValues.map(item => ({ label: item, value: item }))) : null,
      onChange: (value) => onChange(props.name, value)
    }
  }) : [];

  return (
    <>
    <div className="form-section extended-property-section">
      {/* <div className="extended-property-label">Extended Properties</div> */}
      {
        formGroupData.map(formElement => <FormElement {...formElement} readOnly={readOnly} />)
      }
    </div>
    </>
  );
}

export default ExtendedProperties;

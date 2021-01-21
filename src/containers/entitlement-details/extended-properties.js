import React from "react";

import './style.scss';
import { getFormType } from "../../utils";
import FormElement from "../../components/form-element";

const ExtendedProperties = ({
  entitlementData={},
  extendedProps=[],
  readOnly,
  onChange,
  errors={}
}) => {

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
      onChange: (value) => onChange(props.name, value),
      readOnly: readOnly || props.name === 'approval_levels',
      error: errors[props.name],
      required: ['input', 'dropdown'].includes(formType) && props.name !== 'approval_levels',
    }
  }) : [];

  return (
    <>
    <div className="form-section extended-property-section">
      {/* <div className="extended-property-label">Extended Properties</div> */}
      {
        formGroupData.map(formElement => <FormElement {...formElement} />)
      }
    </div>
    </>
  );
}

export default ExtendedProperties;

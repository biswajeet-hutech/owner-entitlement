import React from "react";

import './style.scss';
import FormElement from "../../components/form-element";
import ExtendedProperties from "./extended-properties";

const BaseProperties = ({
  data={
    EntitlementDetails: {},
    ExtentedAttributeProperties: []
  },
  readOnly
}) => {
  const entitlementData = data.EntitlementDetails || {};
  const readOnlyFormConfig = [
    {
      key: 'application',
      label: 'Application',
      value: entitlementData.application,
      type: 'input',
      readOnly: true
    },
    // {
    //   key: 'type',
    //   label: 'Type',
    //   value: entitlementData.type,
    //   type: 'input',
    //   readOnly: true
    // },
    // {
    //   key: 'attribute',
    //   label: 'Attribute',
    //   value: entitlementData.attribute,
    //   type: 'input',
    //   readOnly: true
    // },
    {
      key: 'value',
      label: 'Value',
      value: entitlementData.value,
      type: 'input',
      readOnly: true
    },
    {
      key: 'lastRefreshed',
      label: 'Last Refreshed',
      value: entitlementData.lastrefresh,
      type: 'input',
      readOnly: true
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
      value: entitlementData.modified,
      type: 'input',
      readOnly: true
    },
  ]

  const writableFormConfig = [
    {
      key: 'displayValue',
      label: 'Display Value',
      value: entitlementData.displayName,
      type: 'input',
      readOnly
    },
    {
      key: 'requestable',
      label: 'Requestable',
      value: entitlementData.requestable === "true",
      type: 'checkbox',
      readOnly
    },
    {
      key: 'description',
      label: 'Description',
      value: entitlementData.description,
      type: 'description',
      readOnly
    }
  ]

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
    <ExtendedProperties entitlementData={data} />
    </>
  );
}

export default BaseProperties;

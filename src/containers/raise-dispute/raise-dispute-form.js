import React from "react";

import { Row } from "antd";
import Button from "../../components/button";
import FormElement from "../../components/form-element";
import './style.scss';
import fetchUserList from "../../utils/user";

const RaiseDisputeForm = ({
  onChange,
  disputeData = {},
  onHide,
  onSubmit,
  error,
  entitlementData,
  allowedActions=[]
}) => {

  const { disputeStatement, action } = disputeData;

  const formConfig = [
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
      key: 'displayValue',
      label: 'Display Value',
      value: entitlementData.displayName,
      type: 'input',
      readOnly: true
    },
    {
      key: 'requestable',
      label: 'Requestable',
      value: entitlementData.requestable === "true",
      type: 'checkbox',
      readOnly: true
    },
    {
      key: 'description',
      label: 'Description',
      value: entitlementData.description,
      type: 'description',
      maxLength:2000,
      readOnly: true
    },
  ];

  const writableformConfig = [
    {
      ...(
        allowedActions.length ? {
          key: 'action',
          label: 'Select Dispute/Transfer',
          options: allowedActions.map(item => ({ label: item, value: item })),
          value: action,
          required: true,
       //   needHelp :'YES',
          type: 'dropdown'
      } : {})
    },
    {
      ...(
        action?.includes("Transfer Ownership") ? {
          key: 'owner',
          label: 'New Owner',
          placeholder: 'Search by user name',
          fetchOptions: fetchUserList,
          // options: allowedActions.map(item => ({ label: item, value: item })),
          // value: owner,
          required: true,
          showSearch: true,
          style: { width: '100%' },
          type: 'search-dropdown',
          onChange: (value) => onChange('owner', value)
      } : {})
    },
    {
      key: 'disputeStatement',
      label: 'Dispute/Transfer Statement',
      value: disputeStatement,
      required: !(action?.includes("Transfer Ownership")),
      type: 'textarea',
      needHelp :'YES',
      maxLength: 250
    }
  ]

  return (
    <>
    <div className="form-section form-section-readonly">
      {
        formConfig.map(formElement => <FormElement {...formElement} />)
      } 
    </div>
    <div className="form-section form-section-writable">
      {
        writableformConfig.filter(item => Object.keys(item).length).map(formElement => (
          <FormElement
            onChange={(value) => onChange(formElement.key, value)}
            {...formElement}
            error={error[formElement.key]}
          />
        ))
      }
      <Row justify="end" className="dispute_Footer">
        <Button type="secondary" size="large" className="cancel"  onClick={onHide}>Cancel</Button>
        <Button type="primary" size="large" className="dispute" onClick={onSubmit}>Submit</Button>
      </Row>
    </div>
    </>
  );
}

export default RaiseDisputeForm;

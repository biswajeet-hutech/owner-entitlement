import React from "react";

import { Row } from "antd";
import Button from "../../components/button";
import FormElement from "../../components/form-element";
import './style.scss';

const RaiseDisputeForm = ({
  onChange,
  comment,
  onHide,
  onSubmit,
  error,
  entitlementData
}) => {

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
    // {
    //   key: 'lastRefreshed',
    //   label: 'Last Refreshed',
    //   value: entitlementData.lastrefresh,
    //   type: 'input',
    //   readOnly: true
    // },
    // {
    //   key: 'lastModified',
    //   label: 'Last Modified',
    //   value: entitlementData.modified,
    //   type: 'input',
    //   readOnly: true
    // },
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
      key: 'disputeStatement',
      label: 'Dispute Statement',
      value: '',
      required:true,
      type: 'textarea',
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
        writableformConfig.map(formElement => <FormElement {...formElement} onChange={onChange} value={comment} error={error.comment}/>)
      }
      <Row justify="end" className="dispute_Footer">
        <Button type="secondary" size="large" className="cancel"  onClick={onHide}>Cancel</Button>
        <Button type="primary" size="large" className="dispute" onClick={onSubmit}>Raise Dispute</Button>
      </Row>
    </div>
    </>
  );
}

export default RaiseDisputeForm;

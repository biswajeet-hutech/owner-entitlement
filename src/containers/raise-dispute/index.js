import React from "react";

import { Spin } from "antd";

import './style.scss';
import Accordion from "../../components/accordion";
import Tabs from "../../components/tab";
import RaiseDisputeForm from "./raise-dispute-form";
import API from "../../api";

const RaiseDispute = ({
  onHide,
  onSuccess,
  onError,
  entitlementData
}) => {
  const [disputeComment, setDisputeComment] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState({});
  const handleUpdate = (value) => {
    setError({});
    setDisputeComment(value);
  }

  const raiseDisputeAPI = ({ entID, disputeComment }) => {
    setLoading(true);
    const baseURL = 'EntitlementManagement/dispute';
    API.post(baseURL, {
      message: disputeComment,
      id: entID
    }).then(response => {
      // console.log(response);
      // message.success("Dispute Raised!");
      onSuccess();
    }).catch(err => {
      console.log(err);
      onError();
    }).then(res => {
      setLoading(false);
    });
  }

  const handleSubmit = () => {
    if (!disputeComment) {
      setError({
        comment: 'Please provide some comment.'
      })
    } else {
      raiseDisputeAPI({
        entID: entitlementData.id,
        disputeComment
      });
    }
  }

  const panelData = [{
    title: 'Entitlement Properties',
    subTitle: 'Provide a dispute comment to raise dispute',
    content: <RaiseDisputeForm entitlementData={entitlementData} onChange={handleUpdate} comment={disputeComment} onHide={onHide} onSubmit={handleSubmit} error={error} />
  }];

  const tabsData = [{
    name: 'Raise Dispute',
    content: <div className="oe-ed-wrapper dispute"><Accordion defaultActiveKey={['0', '1', '2']} panelData={panelData} /></div>
  }]

  return (
    <Spin spinning={loading}>
      {/* <Tabs tabs={tabsData} filled defaultActiveKey="2" /> */}
      {tabsData[0].content}
    </Spin>
  );
}

export default RaiseDispute;

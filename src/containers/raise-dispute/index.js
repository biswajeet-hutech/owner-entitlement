import React from "react";
import { Spin } from "antd";

import {DisputeModal} from '../../assets';
import Accordion from "../../components/accordion";
import RaiseDisputeForm from "./raise-dispute-form";
import API from "../../api";

import './style.scss';

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
      if (response.data && response.data.status === 'success') {
        onSuccess();
      } else {
        onError(response.message);
      }
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
    icon:<DisputeModal/>,
    content: <RaiseDisputeForm entitlementData={entitlementData} onChange={handleUpdate} comment={disputeComment} onHide={onHide} onSubmit={handleSubmit} error={error} />
  }];

  return (
    <Spin spinning={loading}>
      <div className="oe-ed-wrapper dispute"><Accordion defaultActiveKey={['0', '1', '2']} panelData={panelData} /></div>
    </Spin>
  );
}

export default RaiseDispute;

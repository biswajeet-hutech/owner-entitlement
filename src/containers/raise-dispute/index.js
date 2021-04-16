import React from "react";
import { Spin } from "antd";

import {DisputeModal} from '../../assets';
import Accordion from "../../components/accordion";
import RaiseDisputeForm from "./raise-dispute-form";
import API, { localMode } from "../../api";

import './style.scss';

const RaiseDispute = ({
  onHide,
  onSuccess,
  onError,
  entitlementData
}) => {
  const [disputeState, setDisputeState] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [allowedActions, setAllowedActions] = React.useState([]);
  const [error, setError] = React.useState({});
  const handleUpdate = (key, value) => {
    setError({});
    setDisputeState({
      ...disputeState,
      [key]: value
    });
  }

  const getAllowedActions = (entitlementid) => {
    const baseURL = `EntitlementManagement/dispute/allowedactions/${entitlementid}`;
    API.get(baseURL).then(response => {
      if (response.data) {
        setAllowedActions(response.data);
      }
    }).catch(err => {
      if (localMode) {
        setAllowedActions(["I do not know owner(Dispute Ownership)","This entitlement is redundant(not needed or wanted)", "Transfer Ownership", "Others"]);
      }
    })
  }

  const raiseDisputeAPI = ({ entID, disputeStatement, action, owner }) => {
    setLoading(true);
    const baseURL = 'EntitlementManagement/dispute';
    API.post(baseURL, {
      message: disputeStatement,
      id: entID,
      action: action,
      owner: owner
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

  const getErrors = () => {
    const errorObj = {};
    const { disputeStatement, action, owner } = disputeState;
    if (!action) {
      errorObj.action = "Please select a reason";
    }

    if (action && !(action.includes("Transfer Ownership")) && !disputeStatement) {
      errorObj.disputeStatement = 'Please provide some comment.';
    }

    if (action && action.includes("Transfer Ownership") && !owner) {
      errorObj.owner = "Please select a owner";
    }

    return errorObj;
  }

  const handleSubmit = () => {
    const errors = getErrors();
    if (Object.keys(errors).length) {
      setError(errors);
    } else {
      raiseDisputeAPI({
        entID: entitlementData.id,
        ...disputeState
      });
    }
  }

  React.useEffect(() => {
    getAllowedActions(entitlementData.id);
  }, []);

  const panelData = [{
    title: 'Entitlement Properties',
    subTitle: 'Provide a dispute comment to raise dispute',
    icon:<DisputeModal/>,
    content: (
      <RaiseDisputeForm
        entitlementData={entitlementData}
        onChange={handleUpdate}
        onHide={onHide}
        onSubmit={handleSubmit}
        error={error}
        allowedActions={allowedActions}
        disputeData={{
          ...disputeState
        }}
      />
    )
  }];

  return (
    <Spin spinning={loading}>
      <div className="oe-ed-wrapper dispute"><Accordion defaultActiveKey={['0', '1', '2']} panelData={panelData} /></div>
    </Spin>
  );
}

export default RaiseDispute;

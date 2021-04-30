import React from "react";
import { message, Spin } from "antd";
import './style.scss';
import Accordion from "../../components/accordion";
import BaseProperties from "./base-properties";
import { API, localMode } from "../../api";
import { messages, SelfReviewApproved, SelfReviewPending } from "../../assets";

const EntitlementDetails = ({
  editMode,
  data={},
  extendedAttributes=[],
  standardAttributes=[],
  onClose = ()=> {},
  onSuccess = ()=> {}
}) => {
  const [loading, setLoading] = React.useState(false);
  const updateEntitlementAPI = (payload) => {
    const url = 'EntitlementManagement/update';
    setLoading(true);
    API.post(url, {
      ...payload
    }).then(res => {
      if (res.data?.status === "success") {
        message.success(messages.SUCCESS_MESSAGE.UPDATE_ENT);
        onSuccess();
      } else {
        message.error(messages.ERRORS.FAILED_UPDATE);
      }
       
    }).catch(err => {
      message.error(messages.ERRORS.FAILED_UPDATE);
    }).then(() => setLoading(false));
  }

  const handleSave = (formData) => {
    const payload = {
      ...formData,
      id: data?.EntitlementDetails?.id
    };

    updateEntitlementAPI(payload);
  }

  const renderTitle = (
    <div>
      <span>
        Entitlement Properties
      </span>
    </div>
  )

  const panelData = [
    {
      title: renderTitle,
      subTitle: `${editMode ? 'Edit' : 'View'} entitlement properties`,
      content: (
        <BaseProperties
          data={data}
          readOnly={!editMode}
          onSave={handleSave}
          onCancel={onClose}
          onSuccess={onSuccess}
          standardAttributes={standardAttributes}
          extendedAttributes={extendedAttributes}
        />
      )
    },
    // {
    //   title: 'Object Attribute',
    //   subTitle: ' ',
    //   content: <ObjectAttributes data={data.EntitlementDetails} readOnly={!editMode} />
    // }, {
    //   title: 'Members',
    //   subTitle: 'Add or remove members',
    //   content: <MembersPanel readOnly={!editMode} />
    // }
  ];

  return (
    <>
    <Spin spinning={loading}>
      <div className={`oe-ed-wrapper ${editMode?'edit':'readOnly'}`}>
        <Accordion defaultActiveKey={['0', '1', '2']} panelData={panelData} />
      </div>
    </Spin>
    </>
  );
}

export default EntitlementDetails;

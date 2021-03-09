import React from "react";
import { message, Spin } from "antd";
import './style.scss';
import Accordion from "../../components/accordion";
import BaseProperties from "./base-properties";
import { API, localMode } from "../../api";

const EntitlementDetails = ({
  editMode,
  data={},
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
       message.success("Updated entitlement properties");
       onSuccess();
    }).catch(err => {
      message.error("Failed to update");
    }).then(() => setLoading(false));
  }

  const handleSave = (formData) => {
    // console.log(formData);
    const payload = {
      ...formData,
      id: data?.EntitlementDetails?.id
    };

    updateEntitlementAPI(payload);
  }

  const panelData = [
    {
      title: 'Entitlement Properties',
      subTitle: `${editMode ? 'Edit' : 'View'} entitlement properties`,
      content: <BaseProperties data={data} readOnly={!editMode} onSave={handleSave} onCancel={onClose} />
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

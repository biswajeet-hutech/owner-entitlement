import React from "react";

import { Popover } from 'antd';

import { InfoIcon } from './../../assets';
import "./style.scss";

const InfoContent = ({ type, onHide, visible, onVisibleChange }) => {
  const getInfoContent = () => {
    switch(type) {
      case 'import':
        return <div>Import Info</div>
      case 'member':
        return <div>Add the info icon and show search First Name, Last Name, Email Address , Status and Manager</div>
      case 'export':
        return <div>You can search and download the selected entitlement or apply advance filter and download.</div>
      case 'scheduledCert':
        return <div>Scheduled Certification Info</div>;
      default:
        return null;
    }
  }

  return (
    <Popover
      content={<div onClick={onHide} style={{ maxWidth: 200 }}>{getInfoContent()}</div>}
      trigger="hover"
      visible={visible}
      onVisibleChange={onVisibleChange}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="oe-info-content-span"><InfoIcon /></span>
    </Popover>
  )
}

export default InfoContent;

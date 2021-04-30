import React from "react";
import { Popover } from 'antd';

import { InfoIcon, strings } from './../../assets';
import "./style.scss";

const InfoContent = ({ type, onHide, visible, onVisibleChange, text }) => {
  const getInfoContent = () => {
    switch(type) {
      case 'import':
        return <div>{strings['info'][type]}</div>
      case 'member':
        return <div>{strings['info'][type]}</div>
      case 'export':
        return <div>{strings['info'][type]}</div>
      case 'scheduledCert':
        return <div>{strings['info'][type]}</div>
      default:
        return <div>{text}</div>;
    }
  }

  return (
    <Popover
      content={<div onClick={onHide} style={{ maxWidth: 200 }}>{getInfoContent()}</div>}
      trigger="hover"
      visible={visible}
      onVisibleChange={onVisibleChange}
      onClick={(e) => {e.preventDefault(); e.stopPropagation();}}
      placement="bottomRight"
    >
      <span className="oe-info-content-span">
        <InfoIcon width={14} height={14} className="normal"/>
        {/* <InfoHoverIcon width={14} height={14} className="hover"/> */}
      </span>
    </Popover>
  )
}

export default InfoContent;

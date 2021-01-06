import React from "react";

import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import "./style.scss";

const InfoContent = ({ type, onHide, visible, onVisibleChange }) => {
  const getInfoContent = () => {
    switch(type) {
      case 'import':
        return <div>Import Info</div>
      case 'export':
        return <div>Export Info</div>
      case 'scheduledCert':
        return <div>Scheduled Certification Info</div>;
      default:
        return null;
    }
  }

  return (
    <Popover
      content={<a onClick={onHide}>{getInfoContent()}</a>}
      trigger="click"
      visible={visible}
      onVisibleChange={onVisibleChange}
      onClick={(e) => e.stopPropagation()}
    >
      <InfoCircleOutlined />
    </Popover>
  )
}

export default InfoContent;

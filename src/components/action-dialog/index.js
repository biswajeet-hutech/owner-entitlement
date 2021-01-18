import React from "react";
import { Modal } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';
import Typography from "../typography";
import "./style.scss";

const ActionDialog = ({
  open,
  onHide,
  type,
  title,
  subTitle,
  children
}) => {

  const renderContent = () => (
    <div className="oe-action-modal-body">
      <div className="oe-action-modal-header">
        {
          type === "success" ? <CheckCircleOutlined className="dialog-icon oe-ad-success" /> : (type === "error" ? <ExclamationCircleOutlined  className="dialog-icon oe-ad-error" /> : null)
        }
      </div>
      <div className="oe-action-modal-content">
        <Typography type="heading3" gutterBottom>{ title }</Typography>
        {/* <h1>{title}</h1> */}
        <Typography type="body1">{ subTitle }</Typography>
      </div>
    </div>
  );

  return (
    <Modal
      className="oe-action-dialog"
      centered
      style={{ top: 20 }}
      visible={open}
      onCancel={onHide}
      onOk={onHide}
      closeIcon={<CloseOutlined style={{ fontSize: 18, color: '#202020', fontWeight: 'bold' }} />}
      width={500}
      destroyOnClose
    >
      <div className="oe-action-dialog-content">
        {
          renderContent() || children
        }
      </div>
    </Modal>
  );
}

export default ActionDialog;

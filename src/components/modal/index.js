import React from "react";
import { Modal as AntModal, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import "./style.scss";

const Modal = ({
  title,
  children,
  onHide,
  open,
  config
}) => (
  <AntModal
    title={title}
    className="oe-modal"
    centered
    style={{ top: 20 }}
    visible={open}
    onCancel={onHide}
    closeIcon={<CloseOutlined style={{ fontSize: 24, color: '#202020', fontWeight: 'bold' }} />}
    width={1180}
    destroyOnClose
    {...config}
  >
    <div className="oe-modal-content">
    {
      children
    }
    </div>
  </AntModal>
)

export default Modal;

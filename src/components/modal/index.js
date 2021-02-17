import React from "react";
import { Modal as AntModal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import "./style.scss";

const Modal = ({
  title,
  children,
  onHide,
  open,
  className,
  width,
  config
}) => (
  <AntModal
    title={title}
    className={`oe-modal ${className?className:''}`}
    centered
    visible={open}
    onCancel={onHide}
    closeIcon={<CloseOutlined style={{ fontSize: 24, color: '#202020', fontWeight: 'bold' }} />}
    width={width ? width : 900}
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

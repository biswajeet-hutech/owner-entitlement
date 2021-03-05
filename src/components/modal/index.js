import React from "react";
import { Modal as AntModal } from 'antd';
import Draggable from 'react-draggable';
import { CloseOutlined } from '@ant-design/icons';
import "./react-resizable.scss";
import "./style.scss";

const Modal = ({
  title,
  subTitle,
  titleIcon,
  children,
  onHide,
  footer,
  open,
  className,
  width,
  config
}) => {
  const [localState, setLocalState] = React.useState({
    visible: false,
    disabled: true,
    bounds: { left: 0, top: 200, bottom: 0, right: 0 },
  });
  const draggleRef = React.createRef();
  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    setLocalState({
      ...localState,
      bounds: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y),
      },
    });
  };
  return (
    <AntModal
      title={
        <div
          style={{ display: 'flex', alignItems: 'center' }}
          onMouseOver={() => {
            if (localState.disabled) {
              setLocalState({
                ...localState,
                disabled: false,
              });
            }
          }}
          onMouseOut={() => {
            setLocalState({
              ...localState,
              disabled: true,
            });
          }}
        >
          {
            titleIcon
          }
          <div>
            <div>
              {title}
            </div>
            <div className="oe-modal-subtitle">{subTitle}</div>
          </div>
        </div>
      }
      className={`oe-modal ${className?className:''}`}
      centered
      visible={open}
      onCancel={onHide}
      closeIcon={<CloseOutlined style={{ fontSize: 24, color: '#202020', fontWeight: 'bold' }} />}
      width={width ? width : 900}
      destroyOnClose
      footer={footer}
      modalRender={modal => (
        <Draggable
          disabled={localState.disabled}
          bounds={localState.bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div ref={draggleRef}>
            {modal}
          </div>
        </Draggable>
      )}
      {...config}
    >
      <div className="oe-modal-content">
        {
          children
        }
      </div>
    </AntModal>
  )
}

export default Modal;

import React from "react";
import { Modal as AntModal } from "antd";
import Draggable from "react-draggable";
import { Resizable } from "re-resizable";
import { CloseOutlined } from "@ant-design/icons";

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
  height,
  config,
}) => {
  const [localState, setLocalState] = React.useState({
    visible: false,
    disabled: true,
    bounds: { left: 0, top: 200, bottom: 0, right: 0 },
  });
  const draggleRef = React.createRef();
  const ele = document.querySelector("#oe-drag > div");
  const _height = ele ? ele.offsetHeight : '78vh';
  const _width = ele ? ele.offsetWidth : 900;
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
      className={`oe-modal ${className ? className : ""}`}
      centered
      visible={open}
      onCancel={onHide}
      closeIcon={
        <CloseOutlined
          style={{ fontSize: 20, color: "#202020", fontWeight: "bold" }}
        />
      }
      width={width ? width : 900}
      height={height || '75%'}
      destroyOnClose
      footer={footer}
      modalRender={(modal) => (
        <Draggable
          disabled={localState.disabled}
          bounds={localState.bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div id="oe-drag" ref={draggleRef}>
            <Resizable
              defaultSize={{
                width: _width,
                height: height || _height
              }}
              minHeight={height || 480}
              minWidth={400}
              maxWidth="100vw"
              maxHeight="100vh"
              boundsByDirection={true}
            >
              {modal}
            </Resizable>
          </div>
        </Draggable>
      )}
      {...config}
    >
      <div className="oe-modal-content">{children}</div>
    </AntModal>
  );
};

export default Modal;

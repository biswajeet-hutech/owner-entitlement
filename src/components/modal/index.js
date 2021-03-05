import React from "react";
import { Modal as AntModal } from "antd";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
// import { DraggableModal, DraggableModalProvider } from 'ant-design-draggable-modal';
import { CloseOutlined } from "@ant-design/icons";
// import 'ant-design-draggable-modal/dist/index.css';
import "./style.scss";
import { logDOM } from "@testing-library/react";

const Modal = ({
  title,
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
  const ele = document.querySelector("#oe-drag > div > div");
  const _height = ele ? ele.offsetHeight : 497;
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
          {title}
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
      height={height ? height : 500}
      destroyOnClose
      footer={footer}
      modalRender={(modal) => (
        <Draggable
          disabled={localState.disabled}
          bounds={localState.bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
        >
          <div id="oe-drag" ref={draggleRef}>
            <ResizableBox
              height={height ? height : _height}
              width={_width}
              onResize={(e, data) => {
                const { size, element } = data;
                const _ele = document.querySelector(
                  "#oe-drag > div > div > div.ant-modal-body"
                );
                if (!size.height) {
                  if (_ele) {
                    const _item = document.querySelector(
                      "#oe-drag > div > div"
                    );
                    console.log(size, ele, _item, element, data);
                    _item.style.height = _item.offsetHeight + "px";
                    _item.style.width = _item.offsetWidth + "px";
                    _ele.style.height = _item.offsetHeight - 100 + "px";
                    _ele.style.width = _item.offsetWidth + "px";
                  }
                } else {
                  if (_ele) {
                    _ele.style.height = size.height - 100 + "px";
                    _ele.style.width = size.width + "px";
                  }
                }
              }}
            >
              {modal}
            </ResizableBox>
          </div>
        </Draggable>
      )}
      {...config}
    >
      {/* <ResizableBox
        width={width || 900}
      > */}
      <div className="oe-modal-content">{children}</div>
      {/* </ResizableBox> */}
    </AntModal>
  );
};

export default Modal;

import React from "react";
import { Collapse } from 'antd';
import "./style.scss";
const { Panel } = Collapse;

const Accordion = ({
  defaultActiveKey,
  panelData
}) => {
  const renderAccordionPanel = ({
    title,
    subTitle,
    icon,
    content,
    key
  }) => (
    <Panel header={(
      <>
        <div className="oe-accordion-title">
          {icon ? icon : null}
          {title}
        </div>
      </>
    )}
      key={key}>
      {
        content
      }
    </Panel>
  );
  // const screens = useBreakpoint();
  return (
    <Collapse
      bordered={false}
      defaultActiveKey={defaultActiveKey}
      expandIconPosition="right"
      className={`oe-accordion`}
      collapsible="disabled"
      expandIcon={({ isActive }) => null}
    >
      {
        panelData.map((panel, index) => renderAccordionPanel({
          title: panel.title,
          subTitle: panel.subTitle,
          key: index,
          content: panel.content
        }))
      }
    </Collapse>
  );
}

export default Accordion;

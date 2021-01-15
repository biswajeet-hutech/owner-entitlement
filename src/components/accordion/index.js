import React from "react";
import { Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import "./style.scss";
const { Panel } = Collapse;

const Accordion = ({
  defaultActiveKey,
  panelData
}) => {
  const renderAccordionPanel = ({
    title,
    subTitle,
    content,
    key
  }) => (
    <Panel header={(
      <>
        <div className="oe-accordion-title">{title}</div>
        {/* {subTitle && <div className="oe-accordion-subtitle">{subTitle}</div>} */}
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
      className="oe-accordion"
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

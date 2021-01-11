import React from "react";
import { Tabs as AntTabs } from 'antd';

import './style.scss';

const { TabPane } = AntTabs;

function callback(key) {
  // console.log(key);
}

const Tabs = ({
  tabs = [],
  filled,
  defaultActiveKey = "1"
}) => (
  <AntTabs defaultActiveKey={defaultActiveKey} onChange={callback} className={`oe-tabs ${filled ? 'filled-tab' : ''}`}>
    {
      Array.isArray(tabs) && tabs.map((tab, index) => (
        <TabPane tab={tab.name} key={index+1} className="oe-tab-content" disabled={tab.disabled}>
          {tab.content}
        </TabPane>
      ))
    }
  </AntTabs>
);


export default Tabs;

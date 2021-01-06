import React from "react";

import './App.scss';
import Tabs from './components/tab';
import Typography from './components/typography';

import 'antd/dist/antd.css';
import OwnerEntitlement from './containers/owner-entitlement-list';

function App() {
  return (
    <div className="oe-app">
      <Typography type="heading3" className="oe-section oe-page-margin">Owner Entitlement</Typography>
      <Tabs tabs={[{
        name: 'Owner Entitlement',
        content: <OwnerEntitlement />
      },
      {
        name: 'Other Tab',
        content: 'Hello 2',
        disabled: true
      }]} />
    </div>
  );
}

export default App;

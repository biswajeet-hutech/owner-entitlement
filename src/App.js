import React from "react";
// import '~antd/dist/antd.css';
import './App.scss';
import Tabs from './components/tab';
// import Typography from './components/typography';
import OwnerEntitlement from './containers/owner-entitlement-list';

function App() {
  return (
    <div className="oe-app">
      {/* <Typography type="heading3" className="oe-section oe-page-margin">Owner Entitlement</Typography> */}
      <Tabs 
        className="home_tab"
      tabs={[{
        name: 'Owner Entitlement',
        content: <OwnerEntitlement />
      }]} />
    </div>
  );
}

export default App;

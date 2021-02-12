import React from "react";
// import '~antd/dist/antd.css';
import './App.scss';
import Tabs from './components/tab';
// import Typography from './components/typography';
import OwnerEntitlement from './containers/owner-entitlement-list';
import {backgroundImage} from './assets';
function App() {
  return (
    <div className="oe-app" style={{backgroundImage}}>
      <Tabs 
        className="home_tab"
      tabs={[{
        name: 'Review Owned Entitlements',
        content: <OwnerEntitlement />
      }]} />
    </div>
  );
}

export default App;

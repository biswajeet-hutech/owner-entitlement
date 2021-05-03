import React from "react";
import './App.scss';
import Tabs from './components/tab';
import OwnerEntitlement from './containers/landing-page';
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

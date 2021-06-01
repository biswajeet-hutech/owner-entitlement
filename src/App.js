import React from "react";
import './App.scss';
import OwnerEntitlement from './containers/landing-page';
import {backgroundImage} from './assets';
function App() {
  return (
    <div className="oe-app" style={{backgroundImage}}>
      <div className="home_tab">
        <OwnerEntitlement />
      </div>
    </div>
  );
}

export default App;

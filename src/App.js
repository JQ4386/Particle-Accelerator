import React, { useState } from 'react';
import './App.css';
import Button from './Button';
import ResetButton from './ResetButton';
import Upgrade from './Upgrade';

function App() {
  const [money, setMoney] = useState(0);
  const [totalUpgradeEffect, setTotalUpgradeEffect] = useState(0);

  // prop object to reduce prop clutter
  const manageMoney = {
    money: money,
    setMoney: setMoney,
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Arcade Clicker</h1>
        <p>Money: ${money}</p>
        <Button {...manageMoney} totalUpgradeEffect={totalUpgradeEffect} />
        <ResetButton {...manageMoney} setTotalUpgradeEffect={setTotalUpgradeEffect}/>
        <Upgrade 
          {...manageMoney} 
          upgradeName={"Upgrade 1"} 
          baseCost={10}
          upgradeEffect={1} 
          setTotalUpgradeEffect={setTotalUpgradeEffect}
        />
      </header>
    </div>
  );
}

export default App;

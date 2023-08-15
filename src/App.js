import React, { useState } from 'react';
import './App.css';
import Button from './Button';
import ResetButton from './ResetButton';
import UpgradesTab from './UpgradesTab';

function App() {

  const [money, setMoney] = useState(0);


  const manageMoney = {
    money: money,
    setMoney: setMoney
  }

  const initUpgrades = [{
    id: 1,
    name: "Click Upgrade",
    baseCost: 10,
    upgradeEffect: 1, //+1 $ per click
    numOwned: 0, //number of times this upgrade has been purchased
    tier: 1 //used to classify upgrades for future feature expansion
  }, {
    id: 2,
    name: "Clickier Upgrade",
    baseCost: 100,
    upgradeEffect: 10, 
    numOwned: 0, 
    tier: 1
  }, {
    id: 3,
    name: "Clickiest Upgrade",
    baseCost: 1000,
    upgradeEffect: 100,
    numOwned: 0,
    tier: 1
  }
]


  const [upgrades, setUpgrades] = useState(initUpgrades);

  // prop object to reduce prop clutter
  

  const resetStates = () => {
    setMoney(0);
    setUpgrades(initUpgrades);
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Arcade Clicker</h1>
        <p>Money: ${money}</p>
        <Button {...manageMoney} upgrades={upgrades} />
        <ResetButton resetStates={resetStates} />
        <UpgradesTab {...manageMoney} upgrades={upgrades} setUpgrades={setUpgrades} />
      </header>
    </div>
  );
}


export default App;

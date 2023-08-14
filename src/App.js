import React, { useState } from 'react';
import './App.css';
import Button from './Button';
import ResetButton from './ResetButton';
import Upgrade from './Upgrade';

function App() {
  const [money, setMoney] = useState(0);
  const [totalUpgradeEffect, setTotalUpgradeEffect] = useState(0);
  const [numUpgrades, setNumUpgrades] = useState(0);
  const [cost, setCost] = useState(10);  // Assuming 10 is the initial cost

  // prop object to reduce prop clutter
  const manageMoney = {
    money: money,
    setMoney: setMoney,
  }

  const resetStates = () => {
    setMoney(0);
    setTotalUpgradeEffect(0);
    setNumUpgrades(0);
    setCost(10);  // Reset to the initial cost
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Arcade Clicker</h1>
        <p>Money: ${money}</p>
        <Button {...manageMoney} totalUpgradeEffect={totalUpgradeEffect} />
        <ResetButton resetStates={resetStates} />
        <Upgrade
          {...manageMoney}
          numUpgrades={numUpgrades}
          setNumUpgrades={setNumUpgrades}
          cost={cost}
          setCost={setCost}
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

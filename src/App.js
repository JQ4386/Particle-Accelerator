import React, { useState } from 'react';
import './App.css';
import Button from './Button';
import UpgradeButton from './UpgradeButton';
import ResetButton from './ResetButton';

function App() {
  const [money, setMoney] = useState(0);
  const [totalUpgradeEffect, setTotalUpgradeEffect] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Arcade Clicker</h1>
        <p>Money: ${money}</p>
        <Button money={money} setMoney={setMoney} totalUpgradeEffect={totalUpgradeEffect} />
        <ResetButton money={money} setMoney={setMoney} />
        <UpgradeButton money={money} setMoney={setMoney} cost={10} upgradeEffect={1}  setTotalUpgradeEffect={setTotalUpgradeEffect} />
      </header>
    </div>
  );
}

export default App;

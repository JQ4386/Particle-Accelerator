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

  const [upgrades, setUpgrades] = useState([]);

  // prop object to reduce prop clutter
  

  const resetStates = () => {
    setMoney(0);
    setUpgrades([]);
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

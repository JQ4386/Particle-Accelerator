import React, { useState, useEffect } from 'react';
import './App.css';
import Button from './Button';
import ResetButton from './ResetButton';
import UpgradesTab from './UpgradesTab';

function App() {

  const [money, setMoney] = useState(0);
  const [moneyPerSecond, setMoneyPerSecond] = useState(0);
  const [upgrades, setUpgrades] = useState([]);

  const refreshRate = 10;

  // prop object to reduce prop clutter
  const manageMoney = {
    money: money,
    setMoney: setMoney
  }
  function resetStates() {
    setMoney(0);
    setUpgrades([]);
  }

  //handle money per second
  useEffect(() => {
    let totalPassiveIncome = 0;
    upgrades.forEach(upgrade => {
      if (upgrade.type === 'passive') {
        totalPassiveIncome += upgrade.upgradeEffect * upgrade.numOwned;
      }
    });
    setMoneyPerSecond(totalPassiveIncome);
  }, [upgrades]);

  // handle money increment smoothly for the UI
  useEffect(() => {
    const incrementsPerSecond = refreshRate; // Equals to 6.666... 
    const increment = moneyPerSecond / incrementsPerSecond;

    const interval = setInterval(() => {
      setMoney(prevMoney => {
        const newMoney = prevMoney + increment;
        // Convert the result of toFixed(2) back to a number for further arithmetic
        return Number(newMoney.toFixed(2));
      });
    }, 1000/refreshRate); // Every 150ms

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [moneyPerSecond]);






  return (
    <div className="App">
      <header className="App-header">
        <h1>Neon Incremental</h1>
        <p>Money: ${money.toFixed(2)} (${moneyPerSecond}/s)</p>
        <Button {...manageMoney} upgrades={upgrades} />
        <ResetButton resetStates={resetStates} />
        <UpgradesTab {...manageMoney} upgrades={upgrades} setUpgrades={setUpgrades} />
      </header>
    </div>
  );
}


export default App;

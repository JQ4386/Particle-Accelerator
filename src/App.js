import React, { useState, useEffect } from 'react';
import './App.css';
import ResetButton from './ResetButton';
import UpgradesTab from './UpgradesTab';
import ParticleBox from './ParticleBox';

function App() {

  const [money, setMoney] = useState(0);
  const [moneyPerSecond, setMoneyPerSecond] = useState(0);
  const [upgradeData, setUpgradeData] = useState([]);

  const refreshRate = 60;

  // prop object to reduce prop clutter
  const manageMoney = {
    money: money,
    setMoney: setMoney
  }
  
  function resetStates() {
    setMoney(0);
    setUpgradeData([]);
  }

  //handle money per second
  useEffect(() => {
    let totalPassiveIncome = 0;
    upgradeData.forEach(upgrade => {
      if (upgrade.type === 'passive') {
        totalPassiveIncome += upgrade.upgradeEffect * upgrade.numOwned;
      }
    });
    setMoneyPerSecond(totalPassiveIncome);
  }, [upgradeData]);

  // handle money increment smoothly for the UI
  useEffect(() => {
    const incrementsPerSecond = refreshRate; 
    const increment = moneyPerSecond / incrementsPerSecond;

    const interval = setInterval(() => {
      setMoney(prevMoney => {
        const newMoney = prevMoney + increment;
        // Convert the result of toFixed(2) back to a number for further arithmetic
        return Number(newMoney.toFixed(2));
      });
    }, 1000/refreshRate); 

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [moneyPerSecond]);






  return (
    <div className="App">
      <header className="App-header">
        <h1>Particle Accelerator</h1>
        <p>Money: ${money.toFixed(2)} (${moneyPerSecond}/s)</p>
        <ParticleBox {...manageMoney} refreshRate={refreshRate} />
        <ResetButton resetStates={resetStates} />
        <UpgradesTab {...manageMoney} upgradeData={upgradeData} setUpgradeData={setUpgradeData} />
      </header>
    </div>
  );
}


export default App;

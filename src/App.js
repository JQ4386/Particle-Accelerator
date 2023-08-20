import React, { useState, useEffect } from 'react';
import './App.css';
import ResetButton from './ResetButton';
import UpgradesTab from './UpgradesTab';
import ParticleBox from './ParticleBox';

function App() {

  // Initial Game Constants
  const initMoney = 0;
  const initWallValue = 1;
  const initParticleSpeed = 5;
  const initUpgradeData = [];

  const [money, setMoney] = useState(initMoney);
  const [upgradeData, setUpgradeData] = useState(initUpgradeData);
  const [wallValue, setWallValue] = useState(initWallValue);
  const [particleSpeed, setParticleSpeed] = useState(initParticleSpeed); 

  const refreshRate = 60;

  // prop object to reduce prop clutter
  const manageMoney = {
    money: money,
    setMoney: setMoney
  }
  
  function resetStates() {
    setMoney(initMoney);
    setUpgradeData(initUpgradeData);
    setWallValue(initWallValue);
    setParticleSpeed(initParticleSpeed);
  }

  //handle money per second
  // useEffect(() => {
  //   let totalPassiveIncome = 0;
  //   upgradeData.forEach(upgrade => {
  //     if (upgrade.type === 'passive') {
  //       totalPassiveIncome += upgrade.upgradeEffect * upgrade.numOwned;
  //     }
  //   });
  //   setMoneyPerSecond(totalPassiveIncome);
  // }, [upgradeData]);

  // handle money increment smoothly for the UI
  // useEffect(() => {
  //   const incrementsPerSecond = refreshRate; 
  //   const increment = moneyPerSecond / incrementsPerSecond;

  //   const interval = setInterval(() => {
  //     setMoney(prevMoney => {
  //       const newMoney = prevMoney + increment;
  //       // Convert the result of toFixed(2) back to a number for further arithmetic
  //       return Number(newMoney.toFixed(2));
  //     });
  //   }, 1000/refreshRate); 

  //   // Cleanup the interval when the component is unmounted
  //   return () => clearInterval(interval);
  // }, [moneyPerSecond]);

  //handle wall upgrades 
  useEffect(() => {
    let tempWV = initWallValue;
    upgradeData.forEach(upgrade => {
      if (upgrade.effectType === 'wall') {
        tempWV += upgrade.upgradeEffect * upgrade.numOwned;
      }
    });
    setWallValue(tempWV)
  }, [upgradeData]);

  // //handle particle upgrades 
  useEffect(() => {
    let tempPS = initParticleSpeed;
    upgradeData.forEach(upgrade => {
      if (upgrade.effectType === 'particleSpeed') {
        tempPS += upgrade.upgradeEffect * upgrade.numOwned;
      }
    });
    setParticleSpeed(prevPS => tempPS)
  }, [upgradeData]);






  return (
    <div className="App">
      <header className="App-header">
        <h1>Particle Accelerator</h1>
        <p>Money: ${money.toFixed(2)} </p>
        <ParticleBox {...manageMoney} refreshRate={refreshRate} wallValue={wallValue} particleSpeed={particleSpeed}/>
        <ResetButton resetStates={resetStates} />
        <UpgradesTab {...manageMoney} upgradeData={upgradeData} setUpgradeData={setUpgradeData} />
      </header>
    </div>
  );
}


export default App;

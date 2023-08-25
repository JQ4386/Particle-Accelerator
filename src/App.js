import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

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
  const initBoxSize = 300;
  const initParticleSize = 15;

  // Initialize Game States
  const [money, setMoney] = useState(initMoney);
  const [wallValue, setWallValue] = useState(initWallValue);
  const [particleSpeed, setParticleSpeed] = useState(initParticleSpeed);
  const [upgradeData, setUpgradeData] = useState(initUpgradeData);
  const [boxSize, setBoxSize] = useState(initBoxSize);
  const [particleSize, setParticleSize] = useState(initParticleSize);

  // Initial Particle Data
  const initParticleData = [{
    id: Date.now(),
    position: { x: boxSize / 2, y: boxSize / 2 },
    velocity: { x: 2, y: 3 }
  }];

  const [particleData, setParticleData] = useState(initParticleData);


  const refreshRate = 60;

  function resetStates() {
    setMoney(initMoney);
    setUpgradeData(initUpgradeData);
    setWallValue(initWallValue);
    setParticleSpeed(initParticleSpeed);
    setParticleData(initParticleData)
  }

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

  //handle particle upgrades 
  useEffect(() => {
    let tempPS = initParticleSpeed;
    upgradeData.forEach(upgrade => {
      if (upgrade.effectType === 'particleSpeed') {
        tempPS += upgrade.upgradeEffect * upgrade.numOwned;
      }
    });
    setParticleSpeed(tempPS)
  }, [upgradeData]);

  // handle particle amount upgrades
  const [lastAddedParticles, setLastAddedParticles] = useState(0);

  useEffect(() => {
    let addedParticles = 0;

    upgradeData.forEach(upgrade => {
      if (upgrade.effectType === 'particleAmount') {
        addedParticles += upgrade.upgradeEffect * upgrade.numOwned;
      }
    });

    const diff = addedParticles - lastAddedParticles;

    if (diff > 0) {
      const newParticles = [];
      for (let i = 0; i < diff; i++) {
        newParticles.push({
          id: nanoid(),  // Ensure unique IDs
          position: { x: boxSize / 2, y: boxSize / 2 },
          velocity: { x: 2, y: 3 }
        });
      }
      console.log(newParticles);
      setParticleData(prevParticles => [...prevParticles, ...newParticles]);
      setLastAddedParticles(addedParticles);
    }

  }, [upgradeData, boxSize, lastAddedParticles]);




  // prop object to reduce prop clutter
  const manageMoney = {
    money: money,
    setMoney: setMoney
  }

  const manageUpgrade = {
    upgradeData: upgradeData,
    setUpgradeData: setUpgradeData
  }

  const manageParticles = {
    particleData: particleData,
    setParticleData: setParticleData
  }

  const manageParticleBox = {
    boxSize: boxSize,
    setBoxSize: setBoxSize,
    particleSize: particleSize,
    setParticleSize: setParticleSize
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Particle Accelerator</h1>
        <p>Money: ${money.toFixed(2)} </p>
        <ParticleBox {...manageMoney} {...manageParticles} {...manageParticleBox} refreshRate={refreshRate} wallValue={wallValue} particleSpeed={particleSpeed} />
        <ResetButton resetStates={resetStates} />
        <UpgradesTab {...manageMoney} {...manageUpgrade} {...manageParticles} {...manageParticleBox} />
      </header>
    </div>
  );
}


export default App;

import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import './App.css';
import ResetButton from './ResetButton';
import UpgradesTab from './UpgradesTab';
import ParticleBox from './ParticleBox';

function App() {

  // Initial Game Constants
  const initMoney = 0;
  const initWallValue = 5;
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

  // generate random velocity vector for new particles based on particleSpeed
  function getRandomVelocity(s) {
    const theta = Math.random() * 2 * Math.PI; // random angle in radians
    return {
      x: s * Math.cos(theta),
      y: s * Math.sin(theta)
    };
  }

  // Initial Particle Data
  const initParticleData = [{
    id: Date.now(),
    position: { x: boxSize / 2, y: boxSize / 2 },
    velocity: getRandomVelocity(particleSpeed)
  }];

  const [particleData, setParticleData] = useState(initParticleData);


  const refreshRate = 30;

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
        const newVelocity = getRandomVelocity(particleSpeed);
        newParticles.push({
          id: nanoid(),  // Ensure unique IDs
          position: { x: boxSize / 2, y: boxSize / 2 },
          velocity: newVelocity
        });
      }
      setParticleData(prevParticles => [...prevParticles, ...newParticles]);
      setLastAddedParticles(addedParticles);
    }

  }, [upgradeData, boxSize, lastAddedParticles, particleSpeed, particleData]);

  // adjusting particleSpeed based on speed upgrades
  function adjustVelocity(velocity, newSpeed) {
    const magnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    return {
      x: (velocity.x / magnitude) * newSpeed,
      y: (velocity.y / magnitude) * newSpeed
    };
  }

  useEffect(() => {
    const adjustedParticles = particleData.map(particle => {
      return {
        ...particle,
        velocity: adjustVelocity(particle.velocity, particleSpeed)
      };
    });

    setParticleData(adjustedParticles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleSpeed]);

  // handle particleData after particle collisions
  function handleParticlesUpdate(updatedParticles) {
    setParticleData(updatedParticles);
  }

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
    setParticleSize: setParticleSize,
    handleParticlesUpdate: handleParticlesUpdate
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

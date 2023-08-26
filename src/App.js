import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';

import './App.css';
import ResetButton from './ResetButton';
import UpgradesTab from './UpgradesTab';
import ParticleBox from './ParticleBox';

function App() {

  // Initial Game Constants
  const initMoney = 0;
  const initWallValue = 10;
  const initParticleSpeed = 5;
  const initUpgradeData = useMemo(() => [], []);
  const initBoxSize = 300; // For future use
  const initParticleSize = 15; // For future use

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
  const initParticleData = useMemo(() => [{
    id: Date.now(),
    position: { x: boxSize / 2, y: boxSize / 2 },
    velocity: getRandomVelocity(particleSpeed),
    color: 'rgb(25, 255, 155)'
  }], [boxSize, particleSpeed]);
  const [particleData, setParticleData] = useState(initParticleData);


  const refreshRate = 30;


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

  // generate random color for new particles
  function getRandomColor() {
    const r = Math.floor(Math.random() * 200) + 55;
    const g = Math.floor(Math.random() * 200) + 55;
    const b = Math.floor(Math.random() * 200) + 55;
    return `rgb(${r}, ${g}, ${b})`;
  }

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
          velocity: newVelocity,
          color: getRandomColor()
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

  // Saving and Loading Game State

  // useRef to store previous game states
  const moneyRef = useRef(money);
  const wallValueRef = useRef(wallValue);
  const particleSpeedRef = useRef(particleSpeed);
  const upgradeDataRef = useRef(upgradeData);  
  const lastAddedParticlesRef = useRef(lastAddedParticles);
  const particleDataRef = useRef(particleData);
  
  // useEffect to update useRef values
  useEffect(() => {
    moneyRef.current = money;
    wallValueRef.current = wallValue;
    particleSpeedRef.current = particleSpeed;
    upgradeDataRef.current = upgradeData;
    lastAddedParticlesRef.current = lastAddedParticles;
    particleDataRef.current = particleData;
  }, [money, wallValue, particleSpeed, upgradeData, lastAddedParticles, particleData]);

  // Save Game State
  const saveGameState = useCallback(() => {
    const gameState = {
      money: moneyRef.current,
        wallValue: wallValueRef.current,
        particleSpeed: particleSpeedRef.current,
        upgradeData: upgradeDataRef.current,
        particleData: particleDataRef.current,
        lastAddedParticles: lastAddedParticlesRef.current
    };

    localStorage.setItem('particleAcceleratorState', JSON.stringify(gameState));
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []); // no dependencies because only save game state based on interval

  // Autosave Game State
  useEffect(() => {
    const interval = setInterval(saveGameState, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []); // no dependencies because only save game state based on interval

  // Load Game State
  useEffect(() => {
    const savedState = localStorage.getItem('particleAcceleratorState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setMoney(parsedState.money || initMoney);
      setWallValue(parsedState.wallValue || initWallValue);
      setParticleSpeed(parsedState.particleSpeed || initParticleSpeed);
      setUpgradeData(parsedState.upgradeData || initUpgradeData);
      setParticleData(parsedState.particleData || initParticleData);
      setLastAddedParticles(parsedState.lastAddedParticles || 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hard Reset (Game States to Initial Values)
  function resetStates() {
    setMoney(initMoney);
    setUpgradeData(initUpgradeData);
    setWallValue(initWallValue);
    setParticleSpeed(initParticleSpeed);
    setParticleData(initParticleData)
    setLastAddedParticles(0);
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
        <ParticleBox {...manageMoney} {...manageParticles} {...manageParticleBox} refreshRate={refreshRate} wallValue={wallValue} particleSpeed={particleSpeed} getRandomColor={getRandomColor} />
        <ResetButton resetStates={resetStates} />
        <UpgradesTab {...manageMoney} {...manageUpgrade} {...manageParticles} {...manageParticleBox} />
      </header>
    </div>
  );
}


export default App;

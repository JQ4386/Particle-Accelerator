import React, { useEffect } from "react";

import Upgrade from "./Upgrade";

export default function UpgradesTab({ money, setMoney, upgradeData, setUpgradeData }) {

    //at the start there are no upgrades
    //first upgrade shows up when user has >= 10$
    useEffect(() => {    
        function generateUpgrade(id) {
            if (id <= 10) {
                // Wall Upgrades (IDs 1-10)
                const baseCost = 10 * (10 ** (id - 1));
                return {
                    id: id,
                    name: `Better Walls Tier ${id}`,
                    baseCost: baseCost,
                    upgradeEffect: 1 * (10 ** (id - 1)),
                    effectType: "wall",
                    numOwned: 0,
                    unlockMoney: baseCost,
                    type: "passive" // To Accomodate Future Active Upgrades
                };
            } else {
                // Particle Speed Upgrades (IDs starting from 11)
                const baseCost = 10 * (10 ** (id - 11));
                return {
                    id: id,
                    name: `Faster Tier ${id - 10}`,
                    baseCost: baseCost,
                    effectType: "particleSpeed",
                    upgradeEffect: 1 * (2 ** (id - 11)),
                    numOwned: 0,
                    unlockMoney: baseCost * 1,
                    type: "passive"
                };
            }
        };
        

        function determineNextUpgradeId() {
            const wallUpCount = upgradeData.filter(upg => upg.effectType === 'wall').length;
            const particleSpeedUpCount = upgradeData.filter(upg => upg.effectType === 'particleSpeed').length;
        
            const nextWallUpId = wallUpCount + 1;
            const nextParticleSpeedId = particleSpeedUpCount + 11;
        
            // If the next active upgrade can be unlocked, return its ID
            if (nextWallUpId <= 6 && money >= generateUpgrade(nextWallUpId).unlockMoney) {
                return nextWallUpId;
            }
            // If the next passive upgrade can be unlocked, return its IDnextParticleSpeedId
            else if (nextParticleSpeedId <= 16 && money >= generateUpgrade(nextParticleSpeedId).unlockMoney) {
                return nextParticleSpeedId;
            }
        
            return null; // No new upgrades available
        }
        
        const nextUpgradeId = determineNextUpgradeId();

        // Only attempt to add an upgrade if nextUpgradeId is not null
    if (nextUpgradeId) {
        const nextUpgrade = generateUpgrade(nextUpgradeId);
        if (money >= nextUpgrade.unlockMoney) {
            setUpgradeData(prevUpgrades => {
                return [...prevUpgrades, nextUpgrade];
            });
        }
    }
    
    }, [money, setUpgradeData, upgradeData]);
    
    const upgradeProps = {
        money: money,
        setMoney: setMoney,
        upgradeData: upgradeData,
        setUpgradeData: setUpgradeData
    }

    function calculateCost(id) {
        const cost = upgradeData.find(upgrade => upgrade.id === id)?.baseCost;
        const owned = upgradeData.find(upgrade => upgrade.id === id)?.numOwned;
        return Math.ceil(cost * Math.pow(1.25, owned));
    }


    return (
        <div className="upgrade-container">
            <div className="upgrade-column">
                <h2>Wall Upgrades</h2>
                {upgradeData.filter(upg => upg.effectType === 'wall').map((upgrade) => (
                    <Upgrade 
                        {...upgradeProps} 
                        key={upgrade.id} 
                        name={upgrade.name} 
                        cost={calculateCost(upgrade.id)} 
                        numOwned={upgrade.numOwned} 
                        tier={upgrade.tier} 
                    />
                ))}
            </div>
            <div className="upgrade-column">
                <h2>Speed Upgrades</h2>
                {upgradeData.filter(upg => upg.effectType === 'particleSpeed').map((upgrade) => (
                    <Upgrade 
                        {...upgradeProps} 
                        key={upgrade.id} 
                        name={upgrade.name} 
                        cost={calculateCost(upgrade.id)} 
                        numOwned={upgrade.numOwned} 
                        tier={upgrade.tier} 
                    />
                ))}
            </div>
        </div>
    )
    
}

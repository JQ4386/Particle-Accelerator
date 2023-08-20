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
                    type: "active"
                };
            } else {
                // Particle Speed Upgrades (IDs starting from 11)
                const baseCost = 10 * (10 ** (id - 11));
                return {
                    id: id,
                    name: `Auto Tier ${id - 10}`,
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
            const activeCount = upgradeData.filter(upg => upg.type === 'active').length;
            const passiveCount = upgradeData.filter(upg => upg.type === 'passive').length;
        
            const nextActiveId = activeCount + 1;
            const nextPassiveId = passiveCount + 11;
        
            // If the next active upgrade can be unlocked, return its ID
            if (nextActiveId <= 6 && money >= generateUpgrade(nextActiveId).unlockMoney) {
                return nextActiveId;
            }
            // If the next passive upgrade can be unlocked, return its ID
            else if (nextPassiveId <= 16 && money >= generateUpgrade(nextPassiveId).unlockMoney) {
                return nextPassiveId;
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
                <h2>Active Upgrades</h2>
                {upgradeData.filter(upg => upg.type === 'active').map((upgrade) => (
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
                <h2>Passive Upgrades</h2>
                {upgradeData.filter(upg => upg.type === 'passive').map((upgrade) => (
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

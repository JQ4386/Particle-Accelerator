import React, { useEffect } from "react";

import Upgrade from "./Upgrade";

export default function UpgradesTab({ money, setMoney, upgrades, setUpgrades }) {

    //at the start there are no upgrades
    //first upgrade shows up when user has >= 10$
    useEffect(() => {    
        function generateUpgrade(id) {
            if (id <= 10) {
                // Active Click Upgrades (IDs 1-10)
                const baseCost = 10 * (10 ** (id - 1));
                return {
                    id: id,
                    name: `Clicker Tier ${id}`,
                    baseCost: baseCost,
                    upgradeEffect: 1 * (10 ** (id - 1)),
                    numOwned: 0,
                    tier: 1,
                    unlockMoney: baseCost,
                    type: "active"
                };
            } else {
                // Passive Autoclicker Upgrades (IDs starting from 11)
                const baseCost = 10 * (10 ** (id - 11));
                return {
                    id: id,
                    name: `Auto Tier ${id - 10}`,
                    baseCost: baseCost,
                    upgradeEffect: 1 * (10 ** (id - 11)),
                    numOwned: 0,
                    tier: 1,
                    unlockMoney: baseCost * 1, // Assuming autoclickers are more expensive
                    type: "passive"
                };
            }
        };

        function determineNextUpgradeId() {
            const activeCount = upgrades.filter(upg => upg.type === 'active').length;
            const passiveCount = upgrades.filter(upg => upg.type === 'passive').length;
        
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

        console.log(upgrades)
        console.log("Current Money:", money);
        
        // Only attempt to add an upgrade if nextUpgradeId is not null
    if (nextUpgradeId) {
        const nextUpgrade = generateUpgrade(nextUpgradeId);
        if (money >= nextUpgrade.unlockMoney) {
            setUpgrades(prevUpgrades => {
                return [...prevUpgrades, nextUpgrade];
            });
        }
    }
    
    }, [money, setUpgrades, upgrades]);
    

    const upgradeProps = {
        money: money,
        setMoney: setMoney,
        upgrades: upgrades,
        setUpgrades: setUpgrades
    }

    function calculateCost(id) {
        const cost = upgrades.find(upgrade => upgrade.id === id)?.baseCost;
        const owned = upgrades.find(upgrade => upgrade.id === id)?.numOwned;
        return Math.ceil(cost * Math.pow(1.25, owned));
    }


    return (
        <div className="upgrade-container">
            <div className="upgrade-column">
                <h2>Active Upgrades</h2>
                {upgrades.filter(upg => upg.type === 'active').map((upgrade) => (
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
                {upgrades.filter(upg => upg.type === 'passive').map((upgrade) => (
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

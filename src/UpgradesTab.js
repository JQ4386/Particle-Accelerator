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
            } else if (id <= 20) {
                // Particle Speed Upgrades (IDs starting from 11-20)
                const baseCost = 10 * (10 ** (id - 11));
                return {
                    id: id,
                    name: `Faster Tier ${id - 10}`,
                    baseCost: baseCost,
                    effectType: "particleSpeed",
                    upgradeEffect: 1 * (2 ** (id - 11)),
                    numOwned: 0,
                    unlockMoney: baseCost,
                    type: "passive"
                };
            } else if (id <= 30) {
                //Particle Amount Upgrades (IDs starting from 21-30)
                const baseCost = 10 * (10 ** (id - 21));
                return {
                    id: id,
                    name: `More Particles Tier ${id - 20}`,
                    baseCost: baseCost,
                    effectType: "particleAmount",
                    upgradeEffect: 1 * (2 ** (id - 21)),
                    numOwned: 0,
                    unlockMoney: baseCost,
                    type: "passive"
                };
            }
        };


        function determineNextUpgradeID() {
            const wallUpCount = upgradeData.filter(upg => upg.effectType === 'wall').length;
            const particleSpeedUpCount = upgradeData.filter(upg => upg.effectType === 'particleSpeed').length;
            const particleAmountCount = upgradeData.filter(upg => upg.effectType === 'particleAmount').length;

            const nextWallUpID = wallUpCount + 1;
            const nextParticleSpeedID = particleSpeedUpCount + 11;
            const nextParticleAmountID = particleAmountCount + 21;

            // If the next wall upgrade can be unlocked, return its ID
            if (nextWallUpID <= 6 && money >= generateUpgrade(nextWallUpID).unlockMoney) {
                return nextWallUpID;
            }
            // If the next particleSpeed upgrade can be unlocked, return its ID
            else if (nextParticleSpeedID <= 16 && money >= generateUpgrade(nextParticleSpeedID).unlockMoney) {
                return nextParticleSpeedID;
            }

            else if (nextParticleAmountID <= 26 && money >= generateUpgrade(nextParticleAmountID).unlockMoney) {
                return nextParticleAmountID;
            }


                return null; // No new upgrades available
        }

        const nextUpgradeID = determineNextUpgradeID();

        // Only attempt to add an upgrade if nextUpgradeId is not null
        if (nextUpgradeID) {
            const nextUpgrade = generateUpgrade(nextUpgradeID);
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
                    />
                ))}
            </div>
            <div className="upgrade-column">
                <h2>More Particles</h2>
                {upgradeData.filter(upg => upg.effectType === 'particleAmount').map((upgrade) => (
                    <Upgrade
                        {...upgradeProps}
                        key={upgrade.id}
                        name={upgrade.name}
                        cost={calculateCost(upgrade.id)}
                        numOwned={upgrade.numOwned}
                    />
                ))}
            </div>
        </div>
    )

}

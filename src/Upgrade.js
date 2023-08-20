import React from "react";

export default function Upgrade({ money, setMoney, upgradeData, setUpgradeData, name, cost, numOwned, tier }) {
    
    function handleClick() {
        if (money >= cost) {
            setUpgradeData(prevUpgrades => {
                return prevUpgrades.map(upgrade => {
                    if (upgrade.name === name) {
                        return {
                            ...upgrade,
                            numOwned: upgrade.numOwned + 1,
                            cost: Math.ceil(upgrade.baseCost * Math.pow(1.07, upgrade.numOwned))
                        }
                    }
                    return upgrade;
                })
            })
            setMoney(prevMoney => prevMoney - cost);
            console.log(upgradeData)
        }
    }
    
    return (
        <div>
            <h3>{name} ({Math.floor(numOwned)})</h3>
            <button onClick={handleClick}>Upgrade (${cost})</button>
        </div>
    )
}
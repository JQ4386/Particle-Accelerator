import React from "react";

export default function Upgrade({ money, setMoney, upgrades, setUpgrades, name, cost, numOwned, tier }) {
    
    function handleClick() {
        if (money >= cost) {
            setUpgrades(prevUpgrades => {
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
            console.log(upgrades[0])
            console.log(cost)
        }
    }
    
    return (
        <div>
            <h2>{name} ({numOwned})</h2>
            <button onClick={handleClick}>Upgrade (${cost})</button>
        </div>
    )
}
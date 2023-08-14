import React from "react";

import UpgradeButton from "./UpgradeButton";
// import MaxAllButton from "./MaxAllButton";

export default function Upgrade({money, setMoney, numUpgrades, setNumUpgrades, cost, setCost, upgradeName, upgradeEffect, setTotalUpgradeEffect}) {

    function handleUpgrade() {
        if (money >= cost) {
            setNumUpgrades(prevNumUpgrades => prevNumUpgrades + 1);
            
            // Use the functional form to get the updated numUpgrades
            setCost(prevCost => {
                const newCost = prevCost * (1.1 ** (numUpgrades + 1));
                return Math.ceil(newCost / 5) * 5;
            });
            setTotalUpgradeEffect(prevTotalUpgradeEffect => prevTotalUpgradeEffect + upgradeEffect);
            setMoney(prevMoney => prevMoney - cost);

            console.log("numUpgrades:" + numUpgrades + " cost:" + cost)
        }
    }

    return (
        <div>
            <UpgradeButton 
                numUpgrades={numUpgrades}
                cost={cost}
                name={upgradeName}
                handleUpgrade={handleUpgrade} />
            {/* <MaxAllButton {...manageMoney}/> */}
        </div>
    )
}

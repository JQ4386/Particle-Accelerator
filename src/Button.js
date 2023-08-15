import React from "react"

export default function Button({ money, setMoney, upgrades}) {
    
    function calculateTotalEffect(upgrades) {
        return upgrades.reduce((sum, upgrade) => {
            return sum + (upgrade.upgradeEffect * upgrade.numOwned);
        }, 0);
    }
    
    function handleButtonClick() {
        setMoney(prevMoney => prevMoney + 1 + calculateTotalEffect(upgrades));
    }



    return (
        <button onClick={handleButtonClick}>Click to Earn Money</button>
    )
}
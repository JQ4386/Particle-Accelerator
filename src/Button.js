import React from "react"

export default function Button({ money, setMoney, upgradeData}) {
    
    function calculateTotalEffect(upgradeData) {
        return upgradeData.reduce((sum, upgrade) => {
            // Consider only active upgrades
            if (upgrade.type === 'active') {
                return sum + (upgrade.upgradeEffect * upgrade.numOwned);
            }
            return sum; // If passive, just return the current sum
        }, 0);
    }
    
    function handleButtonClick() {
        setMoney(prevMoney => prevMoney + 1 + calculateTotalEffect(upgradeData));
    }

    return (
        <button onClick={handleButtonClick}>Click to Earn Money</button>
    )
}

import React from "react"

export default function UpgradeButton({numUpgrades, cost, upgradeName, handleUpgrade}) {

    return (
        <div>
            <button onClick={handleUpgrade}>Upgrade (${cost})</button>
            <p>Upgrades purchased: {numUpgrades}</p>
        </div>
    )
}
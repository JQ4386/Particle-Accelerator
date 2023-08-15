import React from "react";

import Upgrade from "./Upgrade";

export default function UpgradesTab({ money, setMoney, upgrades, setUpgrades }) {

    //at the start there are no upgrades
    // const [upgradeList, setUpgradeList] = useState([]);

    //first upgrade shows up when user has > 10$
    // useEffect(() => {
    //     if (money >= 10) {
    //         setUpgradeList(prevUpgrades => {
    //             return [...prevUpgrades, {
    //                 id: 1,
    //                 name: "Click Upgrade",
    //                 baseCost: 10,
    //                 upgradeEffect: 1, //+1 $ per click
    //                 numUpgrades: 0, //number of times this upgrade has been purchased
    //                 tier: 1, //used to classify upgrades for future feature expansion
    //             }]
    //         });
    //     }
    // }, [money]);

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
        <div>
            {/* <Upgrade {...upgradeProps} name={upgrades[0].name} cost={calculateCost(1)} numOwned={upgrades[0].numOwned} tier={upgrades[0].tier} /> */}
            {upgrades.map((upgrade) => (
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
    )
}

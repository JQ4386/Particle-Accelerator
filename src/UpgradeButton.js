import React, {useState} from "react"

export default function UpgradeButton(props) {
    const [count, setCount] = useState(0);

    const handleUpgradeClick = () => {
        if (props.money >= props.cost) {
            props.setMoney(prevMoney => prevMoney - props.cost);
            setCount(prevCount => prevCount + 1);
        }
    }

    return (
        <div>
            <button onClick={handleUpgradeClick}>Upgrade (${props.cost})</button>
            <p>Upgrades purchased: {count}</p>
        </div>
    )
}
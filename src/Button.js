import React from "react"

export default function Button(props) {
    const handleButtonClick = () => {
        props.setMoney(prevMoney => prevMoney + 1);
    }

    return (
        <button onClick={handleButtonClick}>Click to Earn Money</button>
    )
}
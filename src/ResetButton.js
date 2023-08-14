import React, {useState} from "react"

export default function ResetButton(props) {
    const handleResetClick = () => {
        props.setMoney(0);
    }

    return (
        <button onClick={handleResetClick}>Reset</button>
    )
}
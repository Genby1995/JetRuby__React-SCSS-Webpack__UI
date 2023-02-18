import React from "react";

function Button(props) {
    const status = props.status;
    const buttonText = props.text;
    const clickHandler = props.clickHandler
    console.log(props);

    return (
        <button
            disabled={status == "loading"}
            className="button"
            onClick={clickHandler}>
            {status == "loading" 
            ? <span className="spinner"></span>
            : buttonText}
        </button>
    );
}

export default Button;
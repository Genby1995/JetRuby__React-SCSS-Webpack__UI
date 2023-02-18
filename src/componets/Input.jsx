import React, { useState } from "react";

function Input(props) {
    const step = props.step || 1;
    const name = props.name
    const status = props.status;
    const unit = props.unit || "";
    const min = props.min;
    const max = props.max;
    const value = props.value;
    const displayBasis = props.basis || max;
    const changeHandler = props.changeHandler
    const progress = (value - min) / (max - min)
    const displayValue = Math.round(value / displayBasis * 100);

    const [mainValue, setMainValue] = useState(value.toLocaleString('ru-Ru'))

    const handleSliderChange = (e) => {
        changeHandler(e.target.value);
        setMainValue(Number(e.target.value).toLocaleString('ru-Ru'))
    }
    const heandleTextChange = (e) => {
        const newValue = e.target.value.replace(/[^0-9]/g, "")
        setMainValue(Number(newValue).toLocaleString('ru-Ru'));
    }
    const heandleInputBlur = (e) => {
        const newValue = e.target.value.replace(/[^0-9]/g, "")
        if (newValue > max) {
            setMainValue(max);
            changeHandler(max);
        }
        else if (newValue < min) {
            setMainValue(min);
            changeHandler(min);
        }
        else changeHandler(Math.round(newValue));
    }

    return (
        <div className={status == "loading"
            || status == "waiting"
            ? "slider disabled"
            : "slider"}>
            <input
                disabled={status == "loading" || status == "waiting"}
                className="slider__input"
                value={mainValue}
                onChange={heandleTextChange}
                onBlur={heandleInputBlur}
                type="text" />
            {name == "Первый взнос"
                ? <span className="slider__display" >{displayValue + "%"}</span>
                : <span className="slider__unit"> {unit} </span>
            }
            <input
                disabled={status == "loading" || status == "waiting"}
                className="slider__range"
                step={step}
                max={max}
                min={min}
                value={value}
                onChange={handleSliderChange}
                type="range" />
            <span className="slider__progress-line" style={{ width: `calc((100% - 2rem)*${progress})`, maxWidth: "100%" }} />
        </div>
    );
}

export default Input;
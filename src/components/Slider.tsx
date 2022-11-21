import style from '../styles/Slider.module.css';


type Props = {
    min: number;
    max: number;
    value: number;
    step: number;
    onChange: (val: number) => void;
    onClick: () => void;
};

const Slider = ({ min, max, value, step, onChange, onClick }: Props) => {
    const changeTuning = (e: React.ChangeEvent<HTMLInputElement>)=> {
        onChange(parseFloat(e.target.value));
    };

    return (
        <>
            <datalist id="tickmarks">
                <option value="0"></option>
                <option value="25"></option>
                <option value="50"></option>
                <option value="75"></option>
                <option value="100"></option>
            </datalist>
            <input
                type="range"
                className={style.slider}
                list="tickmarks"
                min={min}
                max={max}
                value={value}
                step={step}
                onChange={changeTuning}
                onClick={onClick}
            />
        </>
    );
};

export default Slider;

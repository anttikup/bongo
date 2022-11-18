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
        <input className={style.slider} type="range" min={min} max={max} value={value} step={step} onChange={changeTuning} onClick={onClick} />
    );
};

export default Slider;

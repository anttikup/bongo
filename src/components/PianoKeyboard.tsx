import { useState } from 'react';
import style from '../styles/PianoKeyboard.module.css';

type KeyProps = {
    x: number;
    id: string;
    onClick: (id: string) => void;
    selected: boolean;
};

const WhiteKey = ({ x, id, onClick, selected }: KeyProps) => {
    const handleClick = (event: React.MouseEvent<SVGRectElement>) => {
        onClick(id);
    };

    return (
        <rect
            id={id}
            className={`${style.whiteKey} ${selected ? style.selected : ""}`}
            x={x}
            y="0"
            width="276"
            height="1200"
            onClick={handleClick}
        />
    );
};

const BlackKey = ({ x, id, onClick, selected }: KeyProps) => {
    const handleClick = (event: React.MouseEvent<SVGRectElement>) => {
        onClick(id);
    };

    return (
        <rect
            id={id}
            className={`${style.blackKey} ${selected ? style.selected : ""}`}
            x={x}
            y="0"
            width="156"
            height="720"
            onClick={handleClick}
        />
    );
};



type Props = {
    selected?: string;
    select?: (val: string) => void;
    size: "small" | "medium" | "large" | "max";
};

const PianoKeyboard = ({ size, selected, select }: Props) => {
    //const [selected, setSelected] = useState<string | null>(null);
    const width = (() => {
        switch ( size ) {
            case "small":
                return "33%";
            case "medium":
                return "50%";
            case "large":
                return "75%";
            case "max":
                return "100%";
        }
    })();

    const selectValue = (value: string) => {
        if ( select ) {
            select(value);
        }
    };

    const WIDTH = 1932;
    const octaves = [0, 1, 2, 3];

    return (
        <svg className={style.container} width={width} viewBox={`0 0 ${WIDTH * octaves.length} 1440`}>
            { octaves.map((_, index) => (
                <>
                  <WhiteKey id="c" x={index * WIDTH + 0} onClick={selectValue} selected={selected === "c"} />
                  <WhiteKey id="d" x={index * WIDTH + 276} onClick={selectValue} selected={selected === "d"} />
                  <WhiteKey id="e" x={index * WIDTH + 552} onClick={selectValue} selected={selected === "e"} />
                  <WhiteKey id="f" x={index * WIDTH + 828} onClick={selectValue} selected={selected === "f"} />
                  <WhiteKey id="g" x={index * WIDTH + 1104} onClick={selectValue} selected={selected === "g"} />
                  <WhiteKey id="a" x={index * WIDTH + 1380} onClick={selectValue} selected={selected === "a"} />
                  <WhiteKey id="b" x={index * WIDTH + 1656} onClick={selectValue} selected={selected === "b"} />
                  <BlackKey id="c-d" x={index * WIDTH + 168} onClick={selectValue} selected={selected === "c-d"} />
                  <BlackKey id="d-e" x={index * WIDTH + 492} onClick={selectValue} selected={selected === "d-e"} />
                  <BlackKey id="e-f" x={index * WIDTH + 984} onClick={selectValue} selected={selected === "e-f"} />
                  <BlackKey id="f-g" x={index * WIDTH + 1296} onClick={selectValue} selected={selected === "f-g"} />
                  <BlackKey id="g-a" x={index * WIDTH + 1608} onClick={selectValue} selected={selected === "g-a"} />
                </>
            )) }
        </svg>
    );
};

export default PianoKeyboard;

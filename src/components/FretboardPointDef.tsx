import React from 'react';
//import { useState } from 'react';

import style from '../styles/FretboardPointDef.module.css';


type Props = {
    id: string;
    text?: string;
    selectable?: boolean;
    color?: string;
    visible?: boolean;
};

const FretboardPointDef = ({ id, text, color, selectable, visible }: Props) => {
    return (
        <g id={id}>
            <circle cx="40" cy="20" r="13" className={style.point} fill={color} stroke={color} />
            { text
              && <text
                     className={style.text}
                     x="40"
                     y="20"
                     style={{ fontWeight: 'bold', fontSize: '18px', fontFamily: 'sans-serif', fill: 'white' }}>
                  {text}
              </text>
            }
            { !!visible
              ? <circle cx="40" cy="20" r="13" className={selectable ? style.selectablePointBorder : style.pointBorder} />
              : <circle cx="40" cy="20" r="13" className={selectable ? style.selectablePointHidden : style.pointHidden} />
            }
        </g>
    );
};

export default FretboardPointDef;

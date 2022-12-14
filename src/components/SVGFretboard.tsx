import { useState } from 'react';
import FretboardPointDef from './FretboardPointDef';

import style from '../styles/SVGFretboard.module.css';


type InstrumentString = {
    name: string;
};

type Knob = {
    id: string;
    string: number;
    fret: number;
    text?: string;
    color?: string;
    selectable?: boolean;
    drawFretTitles?: boolean;
};



type Props = {
    strings?: InstrumentString[];
    knobs: Knob[];
    maxFirstFret?: number;
    minLastFret?: number;
    selected?: string;
    select?: (val: string) => void;
    drawFretTitles?: boolean;
};

const fretTitles = [
    "",
    "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
    "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX",
    "XX", "XXI", "XXII", "XXIII", "XXIV"
];
const getFretTitle = (num: number) => {
    return fretTitles[num];
};

const FRET_TITLE_H = 28;
const MARGIN_TOP = 20;
const STRING_GAP_H = 30;
const STRING_TITLE_SPACE_W = 40;
const FRET_W = 80;
const MARGIN_BOTTOM = 20;
const MARGIN_RIGHT = 20;
const defaultStrings = [
    {
        name: 'e'
    },
    {
        name: 'B'
    },
    {
        name: 'G'
    },
    {
        name: 'D'
    },
    {
        name: 'A'
    },
    {
        name: 'E'
    },
];

const makeFretTable = (firstFret: number, lastFret: number): string[] => {
    const frets = lastFret - firstFret + 1;
    const fretArray = [];

    for ( let i = 0; i < frets; i++ ) {
        fretArray[i] = getFretTitle(firstFret + i);
    }

    return fretArray;
};

const SVGFretboard = ({ selected, select, strings, knobs, maxFirstFret = Number.MAX_SAFE_INTEGER, minLastFret = 0, drawFretTitles = true }: Props) => {
    strings = strings || defaultStrings;
    const firstFret: number = knobs.reduce((acc, knob) => Math.min(knob.fret, acc), maxFirstFret);
    // Zeroth and first are always included together.
    const firstDrawnFret = firstFret === 0 ? 1 : firstFret;
    const lastFret = knobs.reduce((acc, knob) => Math.max(knob.fret, acc), minLastFret);

    const fretArray = makeFretTable(firstDrawnFret, lastFret);
    const nFrets = fretArray.length;

    const selectKnob = (knob: Knob) => {
        if ( knob.selectable === false ) {
            return;
        }

        if ( select ) {
            select(knob.id);
        }
    };

    const clickablePositions: Knob[] = [];
    for ( let i = 0; i < strings.length; i++ ) {
        for ( let j = 0; j < nFrets; j++ ) {

            clickablePositions.push({
                id: `${i + 1}-${j + firstFret}`,
                string: i + 1,
                fret: j + firstFret,
                color: 'rgba(1, 1, 1, 0)',
            });
        }
    }

    const fretboardHeight = (strings.length - 1) * STRING_GAP_H + 2;
    const firstStringY = drawFretTitles ? MARGIN_TOP + FRET_TITLE_H : MARGIN_TOP;

    return (
        <svg
            width={`${STRING_TITLE_SPACE_W + nFrets * FRET_W + MARGIN_RIGHT}px`}
            height={`${firstStringY + (strings.length - 1) * STRING_GAP_H + MARGIN_BOTTOM}px`}
            xmlns="http://www.w3.org/2000/svg">
            <>
                <defs>
                    <>
                        <pattern
                            id="grid"
                            width={FRET_W}
                            height={STRING_GAP_H}
                            y={firstStringY}
                            x={STRING_TITLE_SPACE_W}
                            patternUnits="userSpaceOnUse"
                        >
                            <path
                                d={`M0 0 L ${FRET_W} 0 ${FRET_W} ${STRING_GAP_H} 0 ${STRING_GAP_H} Z`}
                                strokeWidth="2"
                                stroke="black"
                                fill="white"
                            />
                        </pattern>

                        { clickablePositions.map(knob => (
                            <FretboardPointDef
                                key={knob.id}
                                id={knob.id}
                                text={knob.text}
                                selectable={knob.selectable !== false}
                                color={selected === knob.id ? '#ed5c1f' : knob.color}
                                visible={selected === knob.id}
                            />
                        )) }

                        { knobs.map(knob => (
                            <FretboardPointDef
                                key={knob.id}
                                id={knob.id}
                                text={knob.text}
                                selectable={knob.selectable !== false}
                                color={knob.color}
                            />
                        )) }
                    </>
                </defs>

                <rect
                    width={nFrets * FRET_W}
                    height={fretboardHeight}
                    fill="url(#grid)"
                    x={STRING_TITLE_SPACE_W}
                    y={firstStringY - 1}
                />
                { firstDrawnFret === 1
                  && <rect
                         width={5}
                         height={fretboardHeight}
                         x={STRING_TITLE_SPACE_W}
                         y={firstStringY - 1}
                  /> }

                { drawFretTitles && fretArray.map((fret, i) => (
                    <text key={String(fret)}
                          x={STRING_TITLE_SPACE_W + FRET_W * i + FRET_W - 20}
                          y={firstStringY / 2}
                          className={style.fretTitle}
                    >
                        {fret}
                    </text>
                )) }

                { strings.map((string, i) => (
                    <text key={string.name}
                          x={STRING_TITLE_SPACE_W/2}
                          y={firstStringY + i * STRING_GAP_H }
                          className={style.stringTitle}
                    >
                        {string.name}
                    </text>
                )) }

                { clickablePositions.map(knob => (
                    <use
                        key={`${knob.string}:${knob.fret}`}
                        x={STRING_TITLE_SPACE_W + (knob.fret - firstDrawnFret) * FRET_W + 20}
                        y={firstStringY + (knob.string - 1) * STRING_GAP_H - 20}
                        href={`#${knob.id}`}
                        onClick={() => selectKnob(knob)}
                        fill={selected === knob.id ? 'blue' : undefined}
                    />
                )) }

                    { knobs.map(knob => (
                        <use
                            key={`${knob.string}:${knob.fret}`}
                            x={STRING_TITLE_SPACE_W + (knob.fret - firstDrawnFret) * FRET_W + 20}
                            y={firstStringY + (knob.string - 1) * STRING_GAP_H - 20}
                            href={`#${knob.id}`}
                            onClick={() => selectKnob(knob)}
                            fill={knob.color}
                        />
                    )) }
            </>
        </svg>
    );
};

export default SVGFretboard;

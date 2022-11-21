import { useEffect, useState } from 'react';

import { Divider, Segment } from 'semantic-ui-react'

import Slider from './Slider';
import style from '../styles/Tuner.module.css';

type Props = {
    src: string;
    deviation: number;
    onChange?: (val: number) => void;
    value: number;
};


const Tuner = ({ src, deviation = 0, onChange, value = 0 }: Props) => {
    const [context, setContext] = useState<AudioContext | null>(null);
    const [sample, setSample] = useState<AudioBuffer | null>(null);
    const [source, setSource] = useState<AudioBufferSourceNode | null>(null);
    const [startTime, setStartTime] = useState(0);
    const [startOffset, setStartOffset] = useState(0);

    useEffect(() => {
        const loadAudio = async (ctx) => {
            const response = await fetch(src);
            const buffer = await response.arrayBuffer();
            setSample(await ctx.decodeAudioData(buffer));
        };

        const ctx = new AudioContext();
        void loadAudio(ctx);
        setContext(ctx);

    }, [src]);

    const stopAudio = () => {
        if ( source !== null  && context !== null ) {
            //setStartOffset(startOffset + context.currentTime - startTime);
            source.stop();
        }
    };

    const playSample = (sample: AudioBuffer) => {
        if ( context ) {
            //setStartTime(context.currentTime);
            stopAudio();
            const newSource = context.createBufferSource();
            newSource.buffer = sample;
            newSource.detune.value = deviation + value;
            //newSource.playbackRate.value = value;

            newSource.connect(context.destination);
            newSource.start(0);//, startOffset % sample.duration);
            setSource(newSource);
        }
    };

    const play = () => {
        if ( sample !== null ) {
            playSample(sample);
        }
    };

    const sliderChanged = (val: number) => {
        if ( onChange ) {
            onChange(val);
        }
        play();
    };


    return (
        <Segment className={style.tuner}>
            <Slider min={-100} max={+100} value={value} step={1} onChange={sliderChanged} onClick={() => play()} />
            <div className={style.value} style={{ backgroundColor: "white" }}>
                <div style={{ backgroundColor: "white black 1px" }}></div>
                {value}
            </div>
        </Segment>
    );
};

export default Tuner;

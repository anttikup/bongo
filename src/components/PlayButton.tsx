import { useEffect, useState } from 'react';
import { Button, Icon } from "semantic-ui-react";

import { AUDIO_PATH } from '../config';

import style from '../styles/PlayButton.module.css';


type Props = {
    src: string;
    detune: number;
    [x:string]: unknown;
};


const PlayButton = ({ src, detune, className }: Props) => {
    const [context, setContext] = useState<AudioContext | null>(null);
    const [sample, setSample] = useState<AudioBuffer | null>(null);
    const [source, setSource] = useState<AudioBufferSourceNode | null>(null);
    //const [startTime, setStartTime] = useState(0);
    //const [startOffset, setStartOffset] = useState(0);
    const [playing, setPlaying] = useState(false);

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
        if ( source !== null ) {
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
            if ( detune ) {
                newSource.detune.value = detune;
            }
            //newSource.playbackRate.value = value;

            newSource.connect(context.destination);
            newSource.start(0);//, startOffset % sample.duration);
            newSource.addEventListener('ended', function (event) {
                console.log("stopped:", event.target === source);
                event.target === source && setPlaying(false);
            });
            setSource(newSource);
            setPlaying(true);
        }
    };

    const play = () => {
        if ( sample !== null ) {
            playSample(sample);
        }
    };

    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        play();
    };

    const keyPressed = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
        if ( ["Enter", " "].includes(event.key) ) {
            event.preventDefault();
            event.stopPropagation();
            play();
        }
    };

    return (
        <Button className={`${style.playButton} ${className}`} onClick={onClick} onKeyPress={keyPressed}>
            <Icon name={!playing ? 'play' : 'volume up'} />
        </Button>
    );
};

export default PlayButton;

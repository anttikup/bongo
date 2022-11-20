import { useEffect, useState } from 'react';
import { Button, Icon } from "semantic-ui-react";

import { AUDIO_PATH } from '../config';

import style from '../styles/PlayButton.module.css';


type Props = {
    src: string;
    detune: number;
    [x:string]: unknown;
};

let context: AudioContext | null = null;
let sample: AudioBuffer | null = null;
let source: AudioBufferSourceNode | null = null;
let startTime = 0;
let startOffset = 0;

const PlayButton = (props: Props) => {
    const { src } = props;
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        context = new AudioContext();
        console.log("loading:", src);
        const loadAudio = async () => {
            const response = await fetch(src);
            const buffer = await response.arrayBuffer();
            if ( context ) {
                try {
                    sample = await context.decodeAudioData(buffer);
                } catch ( err ) {
                    console.error(err);
                }
            }
        };

        void loadAudio();
    }, [src]);

    const stopAudio = () => {
        if ( source !== null  && context !== null ) {
            startOffset += context.currentTime - startTime;
            source.stop();
        }
    };

    function playSample(sample: AudioBuffer) {
        if ( context ) {
            startTime = context.currentTime;
            stopAudio();
            source = context.createBufferSource();
            source.buffer = sample;
            if ( props.detune ) {
                source.detune.value = props.detune;
            }
            //source.playbackRate.value = selectedFloat;

            source.connect(context.destination);
            source.start(0, startOffset % sample.duration);
        }
    }

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
        <Button {...props } className={`${style.playButton} ${props.className}`} onClick={onClick} onKeyPress={keyPressed}>
            <Icon name={!playing ? 'play' : 'volume up'} />
        </Button>
    );
};

export default PlayButton;

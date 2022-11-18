import React from 'react';
//import axios from "axios";
import { useEffect } from 'react';

import { TuningAssignment } from '../../types';
import { AUDIO_PATH } from '../../config';
import Question from '../Question';
import Slider from '../Slider';
import style from '../../styles/Tuning.module.css';

type Props = {
    assignment: TuningAssignment;
    selectAnswer: (answer: number) => void;
    selectedAnswer: number | undefined;
};

let context: AudioContext | null = null;
let sample: AudioBuffer | null = null;
let source: AudioBufferSourceNode | null = null;
let startTime = 0;
let startOffset = 0;

const TuningQuestionCard = ({ assignment, selectAnswer, selectedAnswer }: Props) => {
    const deviation = -assignment.answer;
    const selectedFloat = selectedAnswer ? selectedAnswer : 0;

    useEffect(() => {
        context = new AudioContext();
        const loadAudio = async () => {
            const response = await fetch(AUDIO_PATH(assignment.audioToTune));
            const buffer = await response.arrayBuffer();
            if ( context ) {
                sample = await context.decodeAudioData(buffer);
            }
        };

        void loadAudio();
    }, [assignment.audioToTune]);

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
            if ( isNaN(selectedFloat) ) {
                source.detune.value = deviation;
            } else {
                source.detune.value = deviation + selectedFloat;
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

    const answerChanged = (answer: number) => {
        selectAnswer(answer);
        play();
    };


    return (
        <div className={`assignment ${style.tuning}`}>
            <Question question={assignment.question} />
            <Slider min={-100} max={+100} value={selectedFloat} step={1} onChange={answerChanged} onClick={() => play()} />
            <div className={style.value}>
                {selectedFloat}
            </div>
            <button onClick={play}>play</button>
            val: {selectedFloat}, deviation: {deviation}, answer: {assignment.answer}
        </div>
    );
};

export default TuningQuestionCard;

import React from 'react';
import { useEffect } from 'react';

import { AUDIO_PATH } from '../../config';
import Question from '../Question';
import Tuner from '../Tuner';

import style from '../../styles/Tuning.module.css';

import { AssignmentAnswer, TuningAssignment } from '../../types';


type Props = {
    assignment: TuningAssignment;
    selectAnswer: (answer: number) => void;
    selectedAnswer?: number;
};

let context: AudioContext | null = null;
let sample: AudioBuffer | null = null;
let source: AudioBufferSourceNode | null = null;
let startTime = 0;
let startOffset = 0;

const TuningQuestionCard = ({ assignment, selectAnswer, selectedAnswer }: Props) => {
    const deviation = -assignment.answer;
    const selectedFloat = selectedAnswer ? selectedAnswer : 0;

    const answerChanged = (answer: number) => {
        selectAnswer(answer);
    };


    return (
        <div className={`assignment ${style.tuning}`}>
            <Question question={assignment.question} />

            <Tuner src={AUDIO_PATH(assignment.audioToTune)} deviation={deviation} value={selectedFloat} onChange={answerChanged} />
            val: {selectedFloat}, deviation: {deviation}, answer: {assignment.answer}
        </div>
    );
};

export default TuningQuestionCard;

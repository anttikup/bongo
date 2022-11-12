import React from 'react';

import {
    MultipleChoiceAssignment,
    isTextOnlyOption
} from '../../types';

import Question from '../Question';
import MultipleChoiceOption from '../MultipleChoiceOption';
import style from '../../styles/MultipleChoiceAssignment.module.css';


type Props = {
    assignment: MultipleChoiceAssignment;
    selectAnswer: (answer: string) => void;
    selectedAnswer: string;
};


const MultipleChoiceAssignmentCard = ({ assignment, selectAnswer, selectedAnswer }: Props) => {

    console.log("assignment:", assignment);
    const isTextOnly = assignment.options.every(isTextOnlyOption);

    return (
        <div className={style.assignment}>
            <Question question={assignment.question} />
            <div className={isTextOnly ? style.textOptions : style.multimediaOptions}>
                { assignment.options.map(option => (
                    <MultipleChoiceOption
                        key={option.value}
                        option={option}
                        selectedAnswer={selectedAnswer}
                        selectAnswer={selectAnswer}
                    />
                ))}
            </div>
        </div>
    );
};

export default MultipleChoiceAssignmentCard;

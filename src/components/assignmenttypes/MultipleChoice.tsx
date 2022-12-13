import React from 'react';

import {
    MultipleChoiceAssignment,
    isTextOnlyOption,
    AssignmentAnswer,
} from '../../types';

import Question from '../Question';
import MultipleChoiceOption from '../MultipleChoiceOption';
import style from '../../styles/MultipleChoiceAssignment.module.css';


type Props = {
    assignment: MultipleChoiceAssignment;
    selectAnswer: (answer: AssignmentAnswer) => void;
    selectedAnswer: AssignmentAnswer;
};


const MultipleChoiceAssignmentCard = ({ assignment, selectAnswer, selectedAnswer }: Props) => {
    const isTextOnly = assignment.options.every(isTextOnlyOption);

    return (
        <div className={style.assignment}>
            <Question question={assignment.question} />
            <div className={style.multimediaOptions}>
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

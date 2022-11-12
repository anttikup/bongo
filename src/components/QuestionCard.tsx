import React from 'react';

import { Assignment, MultipleChoiceAssignment, YesNoAssignment } from '../types';
import YesNoQuestionCard from './assignmenttypes/YesNo';
import MultipleChoiceQuestionCard from './assignmenttypes/MultipleChoice';
import style from '../styles/QuestionCard.module.css';

type Props = {
    assignment: Assignment;
    selectAnswer: (answer: string) => void;
    selectedAnswer: string;
};

const QuestionCard = ({ assignment, selectAnswer, selectedAnswer }: Props) => {

    return (
        <div className={style.questionCard}>

            { (() => {
                  switch ( assignment.type ) {
                      case "yesno":
                          return (
                              <YesNoQuestionCard
                                  assignment={assignment as unknown as YesNoAssignment}
                                  selectAnswer={selectAnswer}
                                  selectedAnswer={selectedAnswer}
                              />);

                      case "multiplechoice":
                          return (
                              <MultipleChoiceQuestionCard
                                  assignment={assignment as MultipleChoiceAssignment}
                                  selectAnswer={selectAnswer}
                                  selectedAnswer={selectedAnswer}
                              />
                          );
                  }
                  return (<p className="error">Unknown assignment type: {assignment.type}</p>);
            })() }

        </div>
    );
};

export default QuestionCard;

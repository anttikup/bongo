import React from 'react';

import { Assignment, MultipleChoiceAssignment, YesNoAssignment } from '../types';
import MultipleChoiceQuestionCard from './assignmenttypes/MultipleChoice';
import SortingQuestionCard from './assignmenttypes/Sorting';
import TuningQuestionCard from './assignmenttypes/Tuning';
import YesNoQuestionCard from './assignmenttypes/YesNo';
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
                      case "multiplechoice":
                          return (
                              <MultipleChoiceQuestionCard
                                  assignment={assignment as MultipleChoiceAssignment}
                                  selectAnswer={selectAnswer}
                                  selectedAnswer={selectedAnswer}
                              />
                          );
                      case "sorting":
                          return (
                              <SortingQuestionCard
                                  assignment={assignment as SortingAssignment}
                                  selectAnswer={selectAnswer}
                                  selectedAnswer={selectedAnswer}
                              />
                          );
                      case "tuning":
                          return (
                              <TuningQuestionCard
                                  assignment={assignment as TuningAssignment}
                                  selectAnswer={selectAnswer}
                                  selectedAnswer={selectedAnswer}
                              />
                          );
                      case "yesno":
                          return (
                              <YesNoQuestionCard
                                  assignment={assignment as unknown as YesNoAssignment}
                                  selectAnswer={selectAnswer}
                                  selectedAnswer={selectedAnswer}
                              />);
                  }
                  return (<p className="error">Unknown assignment type: {assignment.type}</p>);
            })() }

        </div>
    );
};

export default QuestionCard;

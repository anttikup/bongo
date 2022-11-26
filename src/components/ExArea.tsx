import React from 'react';
import { useState } from 'react';
import { Header, Progress, Segment } from 'semantic-ui-react';

import ButtonBar from './ButtonBar';
import { Phase, isAssignment } from '../types';
import { Answer, QuestionSet, isNumber, isObject } from '../types';
import ErrorComponent from './Error';
import QuestionCard from './QuestionCard';
import StatusCard, { StatusValue } from './StatusCard';
import style from './styles/ExArea.module.css';

export enum Part {
    Question,
    Result,
}

enum ExercisePhase {
    Practice,
    End,
}

type Props = {
    decrementHealth: () => void;
    exit: (finishedSuccessfully: boolean) => void;
    health: number;
    questionSet: QuestionSet;
    updateStats: (selected: Answer, correct: Answer) => void;
};

const isArray = (obj: unknown): obj is Array<unknown> => {
    return isObject(obj) && ('length' in obj) && isNumber(obj.length);
};

const equals = (obj1: Answer, obj2: Answer, precision: number) => {
    if ( isArray(obj1) && isArray(obj2) ) {
        if ( obj1.length !== obj2.length ) {
            return false;
        }

        for ( let i = 0; i < obj1.length; i++ ) {
            if ( obj1[i] !== obj2[i] ) {
                return false;
            }
        }

        return true;
    }

    if ( isObject(obj1) && isObject(obj2) ) {
        throw new Error("Not implemented");
    }

    if ( precision ) {
        console.log("within precision", precision, obj1, obj2);
        return (obj1 - 10) < obj2 && (obj1 + 10) > obj2;
    }

    return (obj1 === obj2);
};


const ExArea = ({ decrementHealth, exit, health, questionSet, updateStats }: Props) => {
    const [part, setPart] = useState(Part.Question);
    const [assignmentQueue, setAssignmentQueue] = useState([...questionSet]);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [selected, setSelected] = useState<Answer | undefined>(undefined);
    const [phase, setPhase] = useState(ExercisePhase.Practice);

    const onAnswerSelected = (answer: Answer) => setSelected(answer);

    const correctAnswersRequired = questionSet.length - 3;

    const assignmentsLeft = () => {
        return assignmentQueue.length - health;
    };

    const currentAssignment = assignmentQueue.length > 0 ? assignmentQueue[0] : null;


    const isCorrectAnswer = () => {
        if ( currentAssignment && isAssignment(currentAssignment) && selected !== undefined ) {
            return equals(selected, currentAssignment.answer, currentAssignment.answerPrecision);
        }
        return false;
    };

    const onSkip = () => {
        setSelected(undefined);

        if ( assignmentQueue.length > 0 ) {
            setAssignmentQueue([ ...assignmentQueue.slice(1), assignmentQueue[0] ]);
        }
    };

    const onCheck = () => {
        if ( !selected ) {
            return;
        }

        if ( isCorrectAnswer() ) {
            setCorrectAnswers(correctAnswers + 1);
        } else {
            decrementHealth();
        }

        updateStats(selected, currentAssignment.answer);

        setPart(Part.Result);
    };

    const onNext = () => {
        setSelected(undefined);
        setAssignmentQueue(assignmentQueue.slice(1));
        setPart(Part.Question);
        if ( health === 0 || correctAnswers === correctAnswersRequired ) {
            setPhase(ExercisePhase.End);
        }
    };

    const getPhase = () => {
        if ( assignmentsLeft() === 0 ) {
            return Phase.Results;
        }

        if ( health === 0 && part === Part.Question ) {
            return Phase.Results;
        }

        if ( assignmentsLeft() === 1 && part === Part.Result ) {
            return Phase.LastCheck;
        }

        if ( part === Part.Question ) {
            return Phase.Question;
        }

        return Phase.Check;
    };

    return (
        <div className="ex-area">
            Total: {questionSet.length}, correct required: {correctAnswersRequired}, correct: {correctAnswers},
            wrong: {3 - health} =&gt; answered: {correctAnswers + (3 - health)}, n more corrects required: {assignmentsLeft()}
            <Header as="header">
                <Progress value={correctAnswers} total={correctAnswersRequired} autoSuccess color="yellow" />
            </Header>

            <Segment className="task-area">
                { isAssignment(currentAssignment)
                  ? <>
                      <div className="task-content">
                          { phase === ExercisePhase.Practice
                            ? ( part === Part.Question
                              ? <QuestionCard assignment={currentAssignment} selectAnswer={onAnswerSelected} selectedAnswer={selected} />
                              : <StatusCard type={isCorrectAnswer() ? StatusValue.Correct : StatusValue.Wrong} />
                            )
                            : <StatusCard type={health > 0 ? StatusValue.Upgraded : StatusValue.Failed} assignXP={health} />
                          }
                      </div>
                      <ButtonBar
                          checkDisabled={selected === ''}
                          skipDisabled={assignmentsLeft() === 1}
                          phase={getPhase()}
                          onSkip={onSkip}
                          onCheck={onCheck}
                          onNext={onNext}
                          onExit={() => exit(health > 0)}
                      />
                  </>
                  : <ErrorComponent message="Exercise queue is empty" />
                }
            </Segment>
        </div>
    );
};

export default ExArea;

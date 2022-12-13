import {
    PianoKeyboardAssignment,
    AssignmentAnswer,
} from '../../types';

import Question from '../Question';
import PianoKeyboard from '../PianoKeyboard';
import style from '../../styles/PianoKeyboardAssignment.module.css';


type Props = {
    assignment: PianoKeyboardAssignment;
    selectAnswer: (answer: string) => void;
    selectedAnswer: string | undefined;
};


const PianoKeyboardAssignmentCard = ({ assignment, selectAnswer, selectedAnswer }: Props) => {

    return (
        <div>
            <Question question={assignment.question} />
            <div className={style.keyboardContainer}>
                <div className={style.keyboardClip}>
                    <PianoKeyboard
                        selected={selectedAnswer}
                        select={selectAnswer}
                        size="large"
                    />
                </div>
            </div>
        </div>
    );
};

export default PianoKeyboardAssignmentCard;

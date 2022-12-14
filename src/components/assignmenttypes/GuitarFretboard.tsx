import {
    GuitarFretboardAssignment,
    AssignmentAnswer,
} from '../../types';

import Question from '../Question';
import SVGFretboard from '../SVGFretboard';
import style from '../../styles/GuitarFretboardAssignment.module.css';


type Props = {
    assignment: GuitarFretboardAssignment;
    selectAnswer: (answer: string) => void;
    selectedAnswer: string | undefined;
};


const GuitarFretboardAssignmentCard = ({ assignment, selectAnswer, selectedAnswer }: Props) => {
    const knobs = [
        {
            id: 'master',
            string: assignment.main.string,
            fret: assignment.main.fret,
            text: 'e',
            color: 'black',
            selectable: false,
        },
    ];

    const firstFret = assignment.main.fret - 1;
    const lastFret = assignment.main.fret + 4;

    return (
        <div>
            <Question question={assignment.question} />
            <div className={style.keyboardContainer}>
                <SVGFretboard
                    selected={selectedAnswer}
                    select={selectAnswer}
                    knobs={knobs}
                    minLastFret={lastFret}
                    maxFirstFret={firstFret}
                    drawFretTitles={false}
                />
            </div>
        </div>
    );
};

export default GuitarFretboardAssignmentCard;

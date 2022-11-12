import React from 'react';
import { Form, Radio } from 'semantic-ui-react';

import { YesNoAssignment } from '../../types';
import style from '../styles/YesNoAssignment.module.css';

type Props = {
    assignment: YesNoAssignment;
    selectAnswer: (answer: string) => void;
    selectedAnswer: string;
};

const YesNoQuestionCard = ({ assignment, selectAnswer, selectedAnswer }: Props) => {
    return (
        <div className="question">
            <p>{assignment.question.text}</p>
            <Form.Field>
                <Radio label="Wrong answer" value="wrong" checked={selectedAnswer === "wrong"} onChange={() => selectAnswer("wrong")} />
            </Form.Field>
            <Form.Field>
                <Radio label="Right answer" value="right" checked={selectedAnswer === "right"} onChange={() => selectAnswer("right")} />
            </Form.Field>
        </div>
    );
};

export default YesNoQuestionCard;

import {
    Question as QuestionType,
    isTextQuestion,
    isImageQuestion,
    isAudioQuestion,
} from '../types';

import PlayButton from './PlayButton';
import style from '../styles/Question.module.css';


type Props = {
    question: QuestionType | string;
};


const audioPath = (option: QuestionType) =>
    isAudioQuestion(option) ? `/static/audio/${option.audio}` : "";

const imagePath = (option: QuestionType) =>
    isImageQuestion(option) ? `/static/images/${option.image}` : "";


const QuestionComponent = ({ question }: Props) => {

    console.log("question:", question);

    return (
        <div className={style.question}>
            <p>
                {
                    isTextQuestion(question)
                    && <span>{question.text}</span>
                }
                {
                    isTextQuestion(question) && isAudioQuestion(question)
                    && ' '
                }
                {
                    isAudioQuestion(question)
                    && <PlayButton src={audioPath(question)} />
                }
            </p>
            {
                isImageQuestion(question)
                && <img src={imagePath(question)} style={{ minWidth: 200, minHeight: 150 }} />
            }
        </div>
    );
};

export default QuestionComponent;

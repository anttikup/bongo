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
                    && <span dangerouslySetInnerHTML={{ __html: question.text.toString() }} />
                }
            </p>
            {
                isImageQuestion(question)
                && <img className={style.image} src={imagePath(question)} style={{ minWidth: 200, minHeight: 150 }} />
            }
            {
                isAudioQuestion(question)
                && <div className={style.playButtonContainer}>
                    <PlayButton src={audioPath(question)} />
                </div>
            }

        </div>
    );
};

export default QuestionComponent;

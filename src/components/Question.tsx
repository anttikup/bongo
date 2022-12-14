import { AUDIO_PATH, IMAGE_PATH } from '../config';
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


const QuestionComponent = ({ question }: Props) => {

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
                && <img className={style.image} src={IMAGE_PATH(question.image)} style={{ minWidth: 200, minHeight: 150 }} />
            }
            {
                isAudioQuestion(question)
                && <div className={style.playButtonContainer}>
                    <PlayButton src={AUDIO_PATH(question.audio)} />
                </div>
            }

        </div>
    );
};

export default QuestionComponent;

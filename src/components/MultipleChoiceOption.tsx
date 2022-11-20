import { Form, Radio } from 'semantic-ui-react';

import ImageBox from './ImageBox';
import PlayButton from './PlayButton';
import Tabbable from './Tabbable';
import { isTextOnlyOption, isAudioOption, isImageOption, isTextOption, isObject } from '../types';

import style from '../styles/MultipleChoiceOption.module.css';

import type { Option, TextOption } from '../types';


type Props = {
    option: Option;
    selectAnswer: (answer: string) => void;
    selectedAnswer: string;
};


type Event = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.KeyboardEvent<HTMLAnchorElement>;

const isKeypress = (event: unknown):
                   event is React.KeyboardEvent =>
                       isObject(event) && 'type' in event && event.type === "keypress";

const audioPath = (option: Option) =>
    isAudioOption(option) ? `/static/audio/${option.audio}` : "";

const imagePath = (option: Option) =>
    isImageOption(option) ? `/static/images/${option.image}` : "";



const MultipleChoiceOption = ({ option, selectAnswer, selectedAnswer }: Props) => {
    const clicked = (event: Event) => {
        if ( isKeypress(event) ) {
            if ( ['Enter', ' '].includes(event.key) ) {
                selectAnswer(option.value);
            } else if ( event.key === 'p' ) {
                console.log("Play");
            }
        } else if ( event.type === "click" ) {
            selectAnswer(option.value);
        }
    };

    console.log("OPTION:", option);

    return (
        <>
            <Tabbable className={style.option} onActivate={clicked} activatingKeys={['Enter', ' ', 'p']}>
                { isImageOption(option) &&
                  <ImageBox
                      src={imagePath(option)}
                  />
                }
                { isAudioOption(option) &&
                  <PlayButton className={style.playButton} src={audioPath(option)} detune={option.detune} />
                }
                { isTextOption(option) &&
                  <p className={style.optionText}>{option.text}</p>
                }
                <div className={`${style.indicator} ${selectedAnswer === option.value ? style.selected : ""}`}>
                </div>
            </Tabbable>
        </>
    );
};

export default MultipleChoiceOption;

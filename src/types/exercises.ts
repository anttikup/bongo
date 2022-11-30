import {
    isObject,
    isString
} from './basic';


type Url = string;

const isUrl = (val: unknown): val is Url => {
    return isString(val);
};

export enum Phase {
    Question = 0,
    Check = 1,
    LastCheck = 2,
    Results = 3,
}

export type Multi = number | string | boolean;

export type QuestionSet = Assignment[];

export interface Assignment {
    id: string;
    type: string;
    question: Question;
    answer: AssignmentAnswer;
    answerPrecision?: number;
    updateStats?: string[];
}

export const isAssignment = (obj: unknown): obj is Assignment =>
    isObject(obj) && 'type' in obj && 'question' in obj && 'answer' in obj;

export interface YesNoAssignment extends Assignment {
    type: "yesno";
}

export interface MultipleChoiceAssignment extends Assignment {
    type: "multiplechoice";
    options: Option[];
}

export interface SortingAssignment extends Assignment {
    type: "sorting";
    items: Option[];
}

export interface TuningAssignment extends Assignment {
    type: "tuning";
    audioToTune: string;
    answerPrecision: number;
}

export type AssignmentAnswer = string | number | Array<string> | Array<number>;


export interface BaseQuestion {
    text?: string;
    image?: Url;
    audio?: Url;
}

export interface TextQuestion extends BaseQuestion {
    text: string;
}

export interface ImageQuestion extends BaseQuestion {
    image: Url;
}

export interface AudioQuestion extends BaseQuestion {
    audio: Url;
}

export type Question = TextQuestion | ImageQuestion | AudioQuestion;

export const isQuestion = (obj: unknown): obj is Question => isObject(obj);
export const isTextQuestion = (obj: unknown): obj is TextQuestion => isQuestion(obj) && 'text' in obj && isString(obj.text);
export const isImageQuestion = (obj: unknown): obj is ImageQuestion => isQuestion(obj) && 'image' in obj && isUrl(obj.image);
export const isAudioQuestion = (obj: unknown): obj is AudioQuestion => isQuestion(obj) && 'audio' in obj && isUrl(obj.audio);

interface BaseOption {
    value: string;
    key?: string;
    color?: string;
}

export interface TextOption extends BaseOption {
    text: string;
}

export interface ImageOption extends BaseOption {
    image: Url;
}

export interface AudioOption extends BaseOption {
    audio: Url;
    detune: number;
}

export interface MultiOption extends BaseOption {
    text?: string;
    image?: Url;
    audio?: Url;
}

export type Option = TextOption | ImageOption | AudioOption | MultiOption;

export const isOption = (obj: unknown): obj is Option => isObject(obj) && isString(obj.value);
export const isTextOption = (obj: unknown): obj is TextOption => isOption(obj) && 'text' in obj && isString(obj.text);
export const isImageOption = (obj: unknown): obj is ImageOption => isOption(obj) && 'image' in obj && isUrl(obj.image);
export const isAudioOption = (obj: unknown): obj is AudioOption => isOption(obj) && 'audio' in obj && isUrl(obj.audio);

export const isTextOnlyOption = (option: Option) =>
    isTextOption(option) && !isImageOption(option) && !isAudioOption(option);




export type ExerciseDescr = {
    topic: string;
    level: number;
    id: string;
    color: string;
    text: string;
    image: string;
    material?: string;
    levels: number;
    refreshed: string;
};

export type TierDescr = {
    name: string;
    items: ExerciseDescr[];
};

export type Overview = TierDescr[];

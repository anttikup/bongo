/* const isNumber = (obj: unknown): obj is number => {
 *     return typeof obj === "number";
 * };
 *  */


export const isString = (obj: unknown): obj is string => {
    return typeof obj === "string";
};


export const isObject = (obj: unknown): obj is Record<string, unknown> => {
    return typeof obj === "object" && obj !== null;
};


export type Color = string;


export type UIMessage = {
    type: "success" | "error";
    title: string;
    text: string;
};


export type User = {
    id: string;
    username: string | null;
    xp: number;
    xpHistory: Record<string, number>;
};

export const isUser = (obj: unknown): obj is User => {
    return isObject(obj)
        && ("username" in obj)
        && isString(obj.username)
        && ("token" in obj)
        && isString(obj.token);
};


export enum Phase {
    Question = 0,
    Check = 1,
    LastCheck = 2,
    Results = 3,
}

type Url = string;

const isUrl = (obj: unknown) => typeof obj === "string";

export type Multi = number | string | boolean;

export type QuestionSet = Assignment[];

export interface Assignment {
    type: string;
    question: Question;
    answer: AssignmentAnswer;
}

export const isAssignment = (obj: unknown): obj is Assignment =>
    isObject(obj) && 'type' in obj && 'question' in obj && 'answer' in obj;


export interface ImplAssignment extends Assignment {
    type: "ordering";
    items: Option[];
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
}

export interface TextOption extends BaseOption {
    text: string;
}

export interface ImageOption extends BaseOption {
    image: Url;
}

export interface AudioOption extends BaseOption {
    audio: Url;
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
};

export type TierDescr = {
    name: string;
    items: ExerciseDescr[];
};

export type Overview = TierDescr[];

export type ExerciseProgress = {
    val: number;
};


export type UserProgress = Record<string, ExerciseProgress>;

export type UserStats = {
    xp?: TimeSeries;
};

export type TimeSeries = TimeDataPoint[];

type TimeDataPoint = {
    date: Date;
    value: number;
};

type Date = string;

export type UserSettings = {
    username: string;
    email: string;
    notenames: 'b' | 'h' | 'si';
    reminderEnabled: boolean;
    noAudioExercises: boolean;
    noImageExercises: boolean;
    noMicrophoneExercises: boolean;
};





export interface ErrorMessage {
    type: "error";
    title: string;
    text: string;
}

export interface InfoMessage {
    type: "success";
    title: string;
    text: string;
}

export interface SuccessMessage {
    type: "success";
    title: string;
    text: string;
}

export type Message = ErrorMessage | InfoMessage | SuccessMessage;

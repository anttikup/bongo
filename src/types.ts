import mongoose from 'mongoose';

export const isNumber = (obj: unknown): obj is number => {
    return typeof obj === "number";
};


export const isString = (obj: unknown): obj is string => {
    return typeof obj === "string";
};


export const isObject = (obj: unknown): obj is Record<string, unknown> => {
    return typeof obj === "object" && obj !== null;
};

export const isArray = <T>(obj: unknown): obj is T[]  => {
    return isObject(obj) && obj.length !== undefined;
};


export type Color = string;


export type UIMessage = {
    type: "success" | "error";
    title: string;
    text: string;
};


export interface User {
    id: string;
    username: string | null;
    xp: number;
    xpHistory: Record<string, number>;
}

export const isUser = (obj: unknown): obj is User => {
    return isObject(obj)
        && ("username" in obj)
        && isString(obj.username)
        && ("token" in obj)
        && isString(obj.token);
};

export type UserInfo = {
    id: string;
    name?: string | null;
    email?: string;
    image?: string;
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

export type ExerciseProgress = {
    val: number;
    updated: string;
};


export type UserProgress = Record<string, ExerciseProgress>;

export type UserStats = {
    xpHistory?: XpByDate;
};

export type XpByDate = Record<DateType, number>;

type DateType = string;


export type UserSettings = {
    username?: string;
    email?: string;
    notenamePreference?: NotenamePreference;
    reminderEnabled?: boolean;
    noAudioExercises?: boolean;
    noImageExercises?: boolean;
    noMicrophoneExercises?: boolean;
};


export type NotenamePreference = 'b' | 'h' | 'si';



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




export type LearningStatsItem = {
    wrong: number;
    right: number;
};

export type LearningStats = Map<string, LearningStatsItem>;


export type StatsCategoryFront = {
    name: string;
    data: LearningStats;
};

export type LearningStatsCategory = {
    userRef: mongoose.Types.ObjectId;
    name: string;
    data: LearningStats;
};


export type DatedValue = {
    val: number;
    updated: string;
};

export interface UserDB {
    id: string;
    userId: string;
    username: string | null;
    progress: Record<string, DatedValue>;
    xp: number;
    xpHistory: Record<string, number>;
    learningStats: LearningStatsCategory[];
}


export function isUserDB(user: unknown): user is UserDB {
    return isObject(user)
        && isString(user.userId)
        && isObject(user.progress)
        && isNumber(user.xp)
        && isObject(user.xpHistory)
        && isArray<LearningStatsCategory>(user.learningStats)
};

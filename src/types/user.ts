import {
    isArray,
    isNumber,
    isObject,
    isString,
} from './basic';

import { LearningStatsCategory } from './learningstats';


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
    email?: string | null;
    image?: string | null;
};


export type UserProgress = Record<string, ExerciseProgress>;

export type ExerciseProgress = {
    val: number;
    updated?: string;
};

export const isExerciseProgress = (obj: unknown): obj is ExerciseProgress => {
    return isObject(obj) && 'val' in obj;
};


export type UserStats = {
    xpHistory?: XpByDate;
};

export type XpByDate = Record<DateType, number>;

type DateType = string;



export type NotenamePreference = 'b' | 'h' | 'si';


export type DatedValue = {
    val: number;
    updated: string;
};

export interface UserDB {
    id: string;
    userId: string;
    username: string | null;
    email: string | null;
    progress: Record<string, DatedValue>;
    xp: number;
    xpHistory: Record<string, number>;
    learningStats: LearningStatsCategory[];
    preferences?: UserPreferences;
}

export interface UserPreferences {
    notenamePreference?: NotenamePreference;
    sendReminders?: boolean;
    noAudioExercises?: boolean;
    noImageExercises?: boolean;
    noMicrophoneExercises?: boolean;
}

export interface UserSettings extends UserPreferences {
    username?: string | null;
    email?: string | null;
}



export function isUserDB(user: unknown): user is UserDB {
    return isObject(user)
        && isString(user.userId)
        && isObject(user.progress)
        && isNumber(user.xp)
        && isObject(user.xpHistory)
        && isArray<LearningStatsCategory>(user.learningStats)
};

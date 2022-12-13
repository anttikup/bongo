import {
    isBoolean,
    isExerciseProgress,
    isNumber,
    isObject,
    isString,
} from '../types';

import type {
    ExerciseProgress,
    LearningStats,
    LearningStatsItem,
    NotenamePreference,
    UserDB,
    UserProgress,
    UserSettings,
} from '../types';



const isRecordWithStringKey = (val: unknown): val is Record<string, unknown> => {
    if ( isObject(val) && val !== null && Object.keys(val).length > 0 ) {
        return true;
    }

    return false;
};


export const parseLearningStats = (val: unknown): LearningStats => {
    if ( !isRecordWithStringKey(val) ) {
        console.error("Incorrect or missing value (not a record):", val);
        throw new Error(`Not a record: ${val}`);
    }

    const map = new Map();
    for ( let key in val ) {
        map.set(key, parseLearningStatsItem(val[key]));
    }

    return map;
};


const isLearningStatsItem = (val: unknown): val is LearningStatsItem => {
    if ( isObject(val) && ('right' in val) && ('wrong' in val) ) {
        return true;
    }

    return false;
};


const parseLearningStatsItem = (val: unknown): LearningStatsItem => {
    if ( isLearningStatsItem(val) ) {
        return {
            right: parseNumberField(val.right, 'right'),
            wrong: parseNumberField(val.wrong, 'wrong'),
        };
    } else {
        throw new Error(`Incorrect or missing item value: ${val}`);
    }
};


type ProgressFields = Partial<UserProgress>;
export const parseUserProgressFields = (obj: unknown): ProgressFields => {
    if ( !isRecordWithStringKey(obj) ) {
        throw new Error('Incorrect or missing value');
    }


    const progressFields: ProgressFields = {
    }

    for ( let key in obj ) {
        progressFields[key] = parseExerciseProgressField(obj[key], key);
    }

    return progressFields;
};

const parseExerciseProgressField = (obj: unknown, fieldName: string): ExerciseProgress=> {
    if ( !isExerciseProgress(obj) ) {
        throw new Error(`incorrect user progress field ${fieldName}: ${obj}`);
    }

    return {
        val: parseIntegerField(obj.val, fieldName),
        updated: ('updated' in obj)
               ? parseStringField(obj.updated, fieldName)
               : undefined
    }
};


type UserSettingsFields = Partial<UserSettings>;
export const parseUserSettingsFields = (fields: Record<string, unknown>): UserSettingsFields => {
    const settingsFields: UserSettingsFields = {
        username: fields.username
                ? parseStringField(fields.username, 'username')
                : undefined,
        email: fields.email
             ? parseStringField(fields.email, 'email')
             : undefined,
        sendReminders: fields.sendReminders
                        ? parseBooleanField(fields.sendReminders, 'sendReminders')
                        : undefined,
        notenamePreference: fields.notenamePreference
                          ? parseNotenamePreferenceField(fields.notenamePreference, 'notenamePreference')
                          : undefined,
        noAudioExercises: fields.noAudioExercises
                        ? parseBooleanField(fields.noAudioExercises, 'noAudioExercises')
                        : undefined,
        noImageExercises: fields.noImageExercises
                        ? parseBooleanField(fields.noImageExercises, 'noImageExercises')
                        : undefined,
        noMicrophoneExercises: fields.noMicrophoneExercises
                             ? parseBooleanField(fields.noMicrophoneExercises, 'noMicrophoneExercises')
                             : undefined,
    }

    return settingsFields;
};

const parseNotenamePreferenceField = (o: unknown, fieldName: string): NotenamePreference => {
    if ( o !== 'b' && o !== 'h' && o !== 'si' ) {
        throw new Error(`Incorrect or missing boolean in field '${fieldName}': ${o}`);
    }

    return o;
}


type UserFields = Partial<UserDB>;
export const parseUserFields = (fields: Record<string, unknown>): UserFields => {
    const userFields: UserFields = {};


    if ( fields.xp ) {
        userFields.xp = parseIntegerField(fields.xp, "xp");
    }

    if ( fields.username ) {
        userFields.username = parseStringField(fields.username, 'username');
    }

    if ( fields.email ) {
        userFields.email = parseStringField(fields.email, 'email');
    }

    return userFields;
};





export const parseIntegerField = (val: unknown, fieldName: string): number => {
    const num = parseNumberField(val, fieldName);
    if ( Math.floor(num) !== num ) {
        throw new Error(`Incorrect or missing integer in field ${fieldName}: ${val}`);
    }

    return num;
};


export const parseNumberField = (val: unknown, fieldName: string): number => {
    if ( !isNumber(val) ) {
        throw new Error(`Incorrect or missing number in field ${fieldName}: ${val}`);
    }

    return val;
};

export const parseNumber = (val: unknown): number => {
    if (!val || !isNumber(val)) {
        throw new Error('Incorrect or missing number');
    }

    return val;
}


export const parseBooleanField = (val: unknown, fieldName: string): boolean => {
    if ( !isBoolean(val) ) {
        throw new Error(`Incorrect or missing boolean in field '${fieldName}': ${val}`);
    }

    return val;
}


export const parseStringField = (text: unknown, fieldName: string): string => {
    if ( !text || !isString(text) ) {
        throw new Error(`Incorrect or missing string in field '${fieldName}': ${text}`);
    }

    return text;
}

import axios from "axios";

import type { User, UserProgress, UserSettings, UserStats, LearningStats } from '../types';



const getUser = async () => {
    const { data: userFromApi } = await axios.get<User>(
        '/api/user',
    );

    // Axios returns the json as string if it is not valid json.
    if ( typeof userFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }

    console.log("getUser:", userFromApi);
    return userFromApi;
};


const updateUser = async (itemsToUpdate: Record<string, unknown>) => {
    console.log("UPDATING USER:", itemsToUpdate);

    const { data: userFromApi } = await axios.patch<User>(
        '/api/user',
        itemsToUpdate
    );

    // Axios returns the json as string if it is not valid json.
    if ( typeof userFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }
    console.log("updateUser:", userFromApi);
    return userFromApi;
};


const getUserSettings = async () => {
    const { data: userSettingsFromApi } = await axios.get<UserSettings>(
        '/api/user/settings',
    );

    // Axios returns the json as string if it is not valid json.
    if ( typeof userSettingsFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }

    console.log("getUserSettings:", userSettingsFromApi);
    return userSettingsFromApi;
};

const updateUserSettings = async (itemsToUpdate: Partial<UserSettings>) => {
    console.log("UPDATING USER SETTINGS:", itemsToUpdate);

    const { data: userSettingsFromApi } = await axios.patch<UserSettings>(
        '/api/user/settings',
        itemsToUpdate
    );

    console.log("updateUserSettings:", userSettingsFromApi);
    return userSettingsFromApi;
};



const getXP = async () => {
    const { data: userFromApi } = await axios.get<User>(
        '/api/user',
    );

    // Axios returns the json as string if it is not valid json.
    if ( typeof userFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }

    return userFromApi.xp;
};

const updateXP = async (value: number) => {
    const itemsToUpdate = {
        xp: value
    };

    console.log("UPDATING:", itemsToUpdate);

    const { data: userFromApi } = await axios.patch<User>(
        '/api/user',
        itemsToUpdate
    );

    // Axios returns the json as string if it is not valid json.
    if ( typeof userFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }
    console.log("updateXP:", userFromApi);
    return userFromApi.xp;
};



const getProgress = async () => {
    const { data: userProgressFromApi } = await axios.get<UserProgress>(
        '/api/user/progress',
    );

    // Axios returns the json as string if it is not valid json.
    if ( typeof userProgressFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }

    return userProgressFromApi;
};

const updateProgress = async (exerciseId: string, value: string | number) => {
    const itemsToUpdate = {
        [exerciseId]: {
            val: value
        }
    };
    console.log("UPDATING:", itemsToUpdate);

    const { data: userProgressFromApi } = await axios.patch<UserProgress>(
        '/api/user/progress',
        itemsToUpdate,
    );

    // Axios returns the json as string if it is not valid json.
    if ( typeof userProgressFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }

    console.log("servicefrontend: got userprogress:", userProgressFromApi);
    return userProgressFromApi;
};



const getLearningStats = async (statsCategory: string) => {
    const { data: learningStatsFromApi } = await axios.get<StatsCategory>(
        `/api/user/learningstats/${statsCategory}`,
    );

    // Axios returns the json as string if it is not valid json.
    if ( typeof learningStatsFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }

    return learningStatsFromApi;
};


const updateLearningStats = async (category: string, stats: LearningStats) => {
    console.log("UPDATING:", stats);

    const { data: learningStatsFromApi } = await axios.put<LearningStats>(
        `/api/user/learningstats/${category}`,
        stats,
    );

    // Axios returns the json as string if it is not valid json.
    if ( typeof learningStatsFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }

    console.log("servicefrontend: got learningstats:", learningStatsFromApi);
    return learningStatsFromApi;
};


const getStats = async () => {
    const { data: userStatsFromApi } = await axios.get<UserStats>(
        '/api/user/stats',
    );

    if ( typeof userStatsFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }

    console.log("userStatsFromApi:", userStatsFromApi);
    return userStatsFromApi;
};




export default {
    getLearningStats,
    getProgress,
    getStats,
    getUser,
    getUserSettings,
    getXP,
    updateLearningStats,
    updateProgress,
    updateUser,
    updateUserSettings,
    updateXP,
};

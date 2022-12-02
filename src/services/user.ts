import axios from "axios";

import type {
    User,
    UserProgress,
    UserSettings,
    UserStats,
    LearningStats,
    LearningStatsCategory
} from '../types';



const getUser = async () => {
    const { data: userFromApi } = await axios.get<User>(
        '/api/user',
    );

    console.log("getUser:", userFromApi);
    return userFromApi;
};


const updateUser = async (itemsToUpdate: Record<string, unknown>) => {
    console.log("UPDATING USER:", itemsToUpdate);

    const { data: userFromApi } = await axios.patch<User>(
        '/api/user',
        itemsToUpdate
    );

    console.log("updateUser:", userFromApi);
    return userFromApi;
};


const getSettings = async () => {
    const { data: settingsFromApi } = await axios.get<UserSettings>(
        '/api/user/settings',
    );

    console.log("getSettings:", settingsFromApi);
    return settingsFromApi;
};

const updateSettings = async (itemsToUpdate: Partial<UserSettings>) => {
    console.log("UPDATING USER SETTINGS:", itemsToUpdate);

    const { data: settingsFromApi } = await axios.patch<UserSettings>(
        '/api/user/settings',
        itemsToUpdate
    );

    console.log("updateSettings:", settingsFromApi);
    return settingsFromApi;
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

    console.log("updateXP:", userFromApi);
    return userFromApi.xp;
};



const getProgress = async () => {
    const { data: userProgressFromApi } = await axios.get<UserProgress>(
        '/api/user/progress',
    );

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

    console.log("servicefrontend: got userprogress:", userProgressFromApi);
    return userProgressFromApi;
};



const getLearningStats = async (statsCategory: string) => {
    const { data: learningStatsFromApi } = await axios.get<LearningStatsCategory>(
        `/api/user/learningstats/${statsCategory}`,
    );

    return learningStatsFromApi;
};


const updateLearningStats = async (category: string, stats: LearningStats) => {
    console.log("UPDATING:", stats);

    const { data: learningStatsFromApi } = await axios.put<LearningStats>(
        `/api/user/learningstats/${category}`,
        stats,
    );

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
    getSettings,
    getStats,
    getUser,
    getXP,
    updateLearningStats,
    updateProgress,
    updateSettings,
    updateUser,
    updateXP,
};

import axios from "axios";

import type { User, UserProgress, UserStats } from '../types';




const getXP = async () => {
    const { data: userXPFromApi } = await axios.get<User>(
        '/api/user',
    );

    // Axios returns the json as string if it is not valid json.
    if ( typeof userXPFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }

    console.log("getXP:", userXPFromApi);
    return userXPFromApi.xp;
};

const updateXP = async (value: number) => {
    const itemsToUpdate = {
        xp: value
    };

    console.log("UPDATING:", itemsToUpdate);

    const { data: userXPFromApi } = await axios.patch<UserProgress>(
        '/api/user',
        itemsToUpdate
    );

    // Axios returns the json as string if it is not valid json.
    if ( typeof userXPFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }
    console.log("updateXP:", userXPFromApi);
    return userXPFromApi.xp;
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

    return userProgressFromApi;
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
    getProgress,
    getStats,
    getXP,
    updateXP,
    updateProgress,
};

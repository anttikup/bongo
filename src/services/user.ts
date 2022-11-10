import axios from "axios";

import { UserProgress, UserStats } from '../types';

let token: string | null = null;

const setToken = (newToken: string) => {
    token = `bearer ${newToken}`;
    console.log("token:", token);
};



const makeAuthorizedConfig = (params: Record<string, unknown>) => (
    typeof token === "string"
    ? {
        headers: { Authorization: token },
        params: params ? params : {},
    }
    : {});



const getProgress = async () => {
    const { data: userProgressFromApi } = await axios.get<UserProgress>(
        '/api/user/progress',
        makeAuthorizedConfig({})
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
        {
            headers: { Authorization: token },
        }
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
        makeAuthorizedConfig({})
    );

    if ( typeof userStatsFromApi === "string" ) {
        throw new Error(`Malformed JSON`);
    }

    return userStatsFromApi;
};




export default {
    getProgress,
    getStats,
    setToken,
    updateProgress
};

import clientPromise from "../lib/mongodb";

import userProgressData from '../../../earo2/mockbackend/api/userprogress.json';
import usersData from '../../../earo2/mockbackend/api/users.json';
import userStatsData from '../../../earo2/mockbackend/api/userstats.json';


import type { ExerciseProgress, UserBackend, UserProgress, UserStats } from '../types';

const userProgress: UserProgress = userProgressData as unknown as UserProgress;
const users: UserBackend[] = usersData as unknown as UserBackend[];
const userStats: UserStats = userStatsData as unknown as UserStats;

const clean = (obj: Record<string, unknown>) => {
    const copy = { ...obj };

    delete copy.__v;
    delete copy._id;
    delete copy.passwordHash;

    return copy;
};


const getDate = () => {
    var date = new Date();
    return date.toISOString().substring(0, 10);
};

const getDateTime = () => {
    var date = new Date();
    return date.toISOString().substring(0, 19);
};



const getProgress = async (user: UserBackend): UserProgress => {
    const userData = await findByUsername(user.name);

    console.log("userData:", userData);
    console.log("progr", userData.progress);

    return userData.progress || {};
};


const updateProgress = async (user: UserBackend, keyval: Partial<UserProgress>): UserProgress => {
    console.log("KEYVAL:", keyval);
    if ( Object.keys(keyval).length !== 1 ) {
        throw new Exception("invalid value, must be single key-value pair");
    }

    const exerciseId = Object.keys(keyval)[0];

    const client = await clientPromise;
    const db = client.db("test");

    const newValue = {
        val: keyval[exerciseId].val,
        updated: getDateTime()
    };

    const updateInfo = await db
        .collection("users")
        .findOneAndUpdate(
            { username: user.name },
            {
                $set: {
                    [`progress.${exerciseId}`]: newValue
                },
            },
            { returnNewDocument: true } // doen't work
        );

    console.log("UPDATED PROGRESS:", updateInfo);

    const updatedUser = {
        ...updateInfo.value,
        progress: {
            ...updateInfo.value.progress,
            [exerciseId]: newValue
        }
    };
    console.log("        PROGRESS:", updatedUser.progress);
    return updatedUser.progress;

};

const getStats = async (user: UserBackend): UserStats => {
    const userData = await findByUsername(user.name);

    console.log("userData:", userData);
    console.log("progr", userData.xpHistory);


    return { xpHistory: userData.xpHistory || {} };
};

const updateUser = async (user: UserBackend, fields: Partial<UserBackend>): UserBackend => {
    try {
        const client = await clientPromise;
        const db = client.db("test");

        const updateInfo = await db
            .collection("users")
            .findOneAndUpdate(
                { username: user.name },
                {
                    $set: {
                        xp: fields.xp,
                        ['xpHistory.' + getDate()]: fields.xp
                    },
                },
                { returnNewDocument: true } // doen't work
            );

        console.log("UPDATED USER:", updateInfo);

        const updatedUser = {
            ...updateInfo.value,
            xpHistory: {
                ...updateInfo.value.xpHistory,
                ['xpHistory.' + getDate()]: fields.xp
            },
            ...fields
        };

        return updatedUser;

    } catch (e) {
        console.error(e);
    }
};

const findByUsername = async (username: string): UserBackend | undefined => {
    try {
        const client = await clientPromise;
        const db = client.db("test");

        const foundUser = await db
            .collection("users")
            .findOne({ username });

        return clean(foundUser);
    } catch (e) {
        console.error(e);
    }
    return null;
};


const isUsernameAvailable = (username: string) => {
    if ( findByUsername(username) ) {
        return false;
    }

    return true;
};

const saveUser = (user: UserBackend) => {
    if ( !isUsernameAvailable(user.username) ) {
        throw new Error("User name already in use");
    }

    const copy = { ...user };
    users.push(copy);

    return copy;
};




export default {
    findByUsername,
    getProgress,
    getStats,
    isUsernameAvailable,
    saveUser,
    updateProgress,
    updateUser,
};

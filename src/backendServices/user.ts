import clientPromise from "../lib/mongodb";

import userProgressData from '../../../earo2/mockbackend/api/userprogress.json';
import usersData from '../../../earo2/mockbackend/api/users.json';
import userStatsData from '../../../earo2/mockbackend/api/userstats.json';


import type { ExerciseProgress, UserBackend, UserProgress, UserStats } from '../types';

const userProgress: UserProgress = userProgressData as unknown as UserProgress;
const users: UserBackend[] = usersData as unknown as UserBackend[];
const userStats: UserStats = userStatsData as unknown as UserStats;

type UserInfo = {
    id: number;
    name: string;
    email: string;
};


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



const getProgress = async (user: UserInfo): UserProgress => {
    const userData = await findByUserID(user.id);

    console.log("userData:", userData);
    console.log("progr", userData.progress);

    return userData.progress || {};
};


const updateProgress = async (user: UserInfo, keyval: Partial<UserProgress>): UserProgress => {
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
            { userID: user.id },
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

const getStats = async (user: UserInfo): UserStats => {
    const userData = await findByUserID(user.id);

    console.log("userData:", userData);
    console.log("progr", userData.xpHistory);


    return { xpHistory: userData.xpHistory || {} };
};

const updateUser = async (user: UserInfo, fields: Partial<UserBackend>): UserBackend => {
    try {
        const client = await clientPromise;
        const db = client.db("test");

        const updateInfo = await db
            .collection("users")
            .findOneAndUpdate(
                { userID: user.id },
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

const findByUserID = async (userID: string): UserBackend | undefined => {
    try {
        const client = await clientPromise;
        const db = client.db("test");

        const foundUser = await db
            .collection("users")
            .findOne({ userID });

        return clean(foundUser);
    } catch (e) {
        console.error(e);
    }
    return null;
};

const findOrCreateUserByUserInfo = async (userInfo: UserInfo): UserBackend | undefined => {
    try {
        const client = await clientPromise;
        const db = client.db("test");

        let foundUser = await findByUserID(userInfo.id);

        if ( foundUser && foundUser.id ) {
            console.log("FOUND USER:", foundUser);
            return foundUser;
        }

        db.collection("users")
          .insertOne({
              userID: userInfo.id,
              username: userInfo.name,
              progress: {
              },
              xp: 0,
              xpHistory: {
                  [getDate()]: 0,
              }
          });

        foundUser = await findByUserID(userInfo.id);
        console.log("CREATED USER:", foundUser);

        return foundUser;
    } catch (e) {
        console.error(e);
    }
    return null;

};

const findOrCreateUserByUserInfo2 = async (userInfo: UserInfo): UserBackend | undefined => {
    try {
        const client = await clientPromise;
        const db = client.db("test");

        const foundUser = await db
            .collection("users")
            .findAndModify({
                query: { userID: userInfo.id },
                update: {
                    $setOnInsert: {
                        userID: userInfo.id,
                        username: userInfo.name,
                        progress: {
                        },
                        xp: 0,
                        xpHistory: {
                            [getDate()]: 0,
                        }
                    }
                },
                new: true,   // return new doc if one is upserted
                upsert: true // insert the document if it does not exist
            });

        console.log("FOUND USER:", foundUser);

        return clean(foundUser);
    } catch (e) {
        console.error(e);
    }
    return null;

};



export default {
    findByUserID,
    getProgress,
    getStats,
    updateProgress,
    updateUser,
    findOrCreateUserByUserInfo,
};

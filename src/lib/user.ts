import clientPromise from "../lib/mongodb";

import { isUserDB } from '../types';
import type {
    ExerciseProgress,
    UserDB,
    UserInfo,
    UserProgress,
    UserStats,
} from '../types';



const getDate = () => {
    var date = new Date();
    return date.toISOString().substring(0, 10);
};

const getDateTime = () => {
    var date = new Date();
    return date.toISOString().substring(0, 19);
};



const getProgress = async (user: UserInfo): Promise<UserProgress> => {
    const userData = await findByUserID(user.id);

    return userData?.progress || {};
};


const updateProgress = async (user: UserInfo, keyval: Partial<UserProgress>): Promise<UserProgress> => {
    if ( Object.keys(keyval).length !== 1 ) {
        throw new Error("invalid value, must be single key-value pair");
    }

    const exerciseId = Object.keys(keyval)[0];
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const newValue = {
        val: keyval[exerciseId]?.val,
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
            //{ returnNewDocument: true } // doen't work
        );

    const updatedUser = {
        ...updateInfo.value,
        progress: {
            ...updateInfo?.value?.progress,
            [exerciseId]: newValue
        }
    };

    return updatedUser.progress;

};

const getStats = async (user: UserInfo): Promise<UserStats> => {
    const userData = await findByUserID(user.id);

    return { xpHistory: userData?.xpHistory || {} };
};

const updateUser = async (user: UserInfo, fields: Partial<UserDB>): Promise<UserDB | null> => {
    console.assert(!('xp' in fields), "can't set xp using updateUser");

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const updateInfo = await db
        .collection("users")
        .findOneAndUpdate(
            { userID: user.id },
            {
                $set: {
                    ...fields
                },
            },
            //{ returnNewDocument: true } // doen't work
        );

    const updatedUser = {
        ...updateInfo.value,
        ...fields
    };

    if ( isUserDB(updatedUser) ) {
        return updatedUser as UserDB;
    }
    return null;
};


const updateXP = async (user: UserInfo, xp: number): Promise<Partial<UserDB>> => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const updateInfo = await db
        .collection("users")
        .findOneAndUpdate(
            { userID: user.id },
            {
                $set: {
                    xp: xp,
                    ['xpHistory.' + getDate()]: xp
                },
            },
            //{ returnNewDocument: true } // doen't work
        );

    console.log("UPDATED USER:", updateInfo);

    const updatedUser = {
        ...updateInfo.value,
        xpHistory: {
            ...updateInfo.value?.xpHistory,
            [getDate()]: xp
        },
    };

    return updatedUser as Partial<UserDB>;

};

const findByUserID = async (userID: string): Promise<UserDB | undefined> => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const foundUser = await db
        .collection("users")
        .findOne({ userID });

    //return clean(foundUser);
    return foundUser as unknown as UserDB;
};


const findOrCreateUserByUserInfo = async (userInfo: UserInfo): Promise<UserDB> => {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    let foundUser = await findByUserID(userInfo.id);

    if ( foundUser && foundUser.userId ) {
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

    if ( !foundUser ) {
        throw new Error("Couldn't create user");
    }

    return foundUser;
};


/* const findOrCreateUserByUserInfo2 = async (userInfo: UserInfo): Promise<UserDB | undefined> => {
 *     try {
 *         const client = await clientPromise;
 *         const db = client.db(process.env.DB_NAME);
 *
 *         const foundUser = await db
 *             .collection("users")
 *             .findAndModify({
 *                 query: { userID: userInfo.id },
 *                 update: {
 *                     $setOnInsert: {
 *                         userID: userInfo.id,
 *                         username: userInfo.name,
 *                         progress: {
 *                         },
 *                         xp: 0,
 *                         xpHistory: {
 *                             [getDate()]: 0,
 *                         }
 *                     }
 *                 },
 *                 new: true,   // return new doc if one is upserted
 *                 upsert: true // insert the document if it does not exist
 *             });
 *
 *         console.log("FOUND USER:", foundUser);
 *
 *         return clean(foundUser);
 *     } catch (e) {
 *         console.error(e);
 *     }
 *     return null;
 *
 * };
 *  */



export default {
    findByUserID,
    getProgress,
    getStats,
    updateProgress,
    updateUser,
    updateXP,
    findOrCreateUserByUserInfo,
};

import dbConnect from './dbconnect'
import User from '../models/user';

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

    await dbConnect();

    const exerciseId = Object.keys(keyval)[0];

    const newValue = {
        val: keyval[exerciseId]?.val,
        updated: getDateTime()
    };

    const updatedUser = await User
        .findOneAndUpdate(
            { userId: user.id },
            {
                [`progress.${exerciseId}`]: newValue
            },
            {
                upsert: true,
                new: true,
            }
        );

    return updatedUser.progress;
};


const getStats = async (user: UserInfo): Promise<UserStats> => {
    const userData = await findByUserID(user.id);

    return { xpHistory: userData?.xpHistory || {} };
};


const updateUser = async (user: UserInfo, fields: Partial<UserDB>): Promise<UserDB | null> => {
    console.assert(!('xp' in fields), "can't set xp using updateUser");

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
        { userId: user.id },
        {
            ...fields
        },
        {
            upsert: true,
            new: true,
        }
    );

    return updatedUser;
};


const updateXP = async (user: UserInfo, xp: number): Promise<Partial<UserDB>> => {
    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
        { userId: user.id },
        {
            xp: xp,
            ['xpHistory.' + getDate()]: xp
        },
        {
            upsert: true,
            new: true,
        }
    );

    return updatedUser;
};

const findByUserID = async (userId: string): Promise<UserDB | undefined> => {
    await dbConnect();
    const foundUser = await User.findOne<UserDB>(
        { userId }
    );

    return foundUser;
};


const findOrCreateUserByUserInfo = async (userInfo: UserInfo): Promise<UserDB> => {
    await dbConnect();
    let foundUser = await findByUserID(userInfo.id);

    if ( !foundUser ) {
        foundUser = new User({
            userId: userInfo.id,
            username: userInfo.name,
            progress: {},
            xp: 0,
            xpHistory: {
                [getDate()]: 0,
            }
        }).save();
    }

    if ( !foundUser ) {
        throw new Error("Couldn't create user");
    }

    return foundUser;
};





export default {
    findByUserID,
    getProgress,
    getStats,
    updateProgress,
    updateUser,
    updateXP,
    findOrCreateUserByUserInfo,
};

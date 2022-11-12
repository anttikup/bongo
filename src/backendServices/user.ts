import userProgressData from '../../../earo2/mockbackend/api/userprogress.json';
import usersData from '../../../earo2/mockbackend/api/users.json';
import userStatsData from '../../../earo2/mockbackend/api/userstats.json';


import type { ExerciseProgress, UserBackend, UserProgress, UserStats } from '../types';

const userProgress: UserProgress = userProgressData as unknown as UserProgress;
const users: UserBackend[] = usersData as unknown as UserBackend[];
const userStats: UserStats = userStatsData as unknown as UserStats;


const getProgress = (_user: UserBackend): UserProgress => {
    return userProgress;
};

const updateProgress = (_user: UserBackend, items: Partial<UserProgress>): UserProgress => {
    for ( let key in items ) {
        if ( items[key] ) {
            userProgress[key] = items[key] as ExerciseProgress;
        }
    }
    return userProgress;
};

const getStats = (_user: UserBackend): UserStats => {
    return userStats;
};


const updateUser = (user: UserBackend, fields: Partial<UserBackend>): UserBackend => {
    const newUser : UserBackend = {
        ...user,
        xp: fields.xp ? fields.xp : user.xp,
    };

    console.log("NEW USER:", newUser);
    return newUser;
};

const findByUsername = (username: string): UserBackend | undefined => {
    return users.find(u => u.username === username);
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

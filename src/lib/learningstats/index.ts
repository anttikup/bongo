import dbConnect from '../dbconnect'
import userLib from '../../lib/user';
import LearningStats from '../../models/learningstats';

import notenameType from './notename';
import WeightedRandomTable from '../../utils/weightedRandomTable';

import type {
    DatedValue,
    LearningStatsCategory as LearningStatsCategory_t,
    LearningStats as LearningStats_t,
    LearningStatsItem,
    UserDB,
    UserInfo,
} from '../../types';


function getDefaults(categoryName: string) {
    switch ( categoryName.toString() ) {
        case 'notename':
            return notenameType.getDefault();
    }

    if ( categoryName === 'notename' ) {
        return notenameType.getDefault();
    }

    console.dir(categoryName);
    throw new Error(`No such category '${categoryName}', hä? ${typeof categoryName}, ${'notename'.split('')}`);
}


async function getLearningStatsForCategory(userInfo: UserInfo, categoryName: string) {
    await dbConnect();
    const user = await userLib.findByUserID(userInfo.id);
    if ( !user ) {
        throw new Error(`User missing: ${userInfo.name}`);
    }

    const result = await LearningStats.findOne<LearningStatsCategory_t>(
        {
            userRef: user.id,
            name: categoryName,
        }
    );

    if ( result ) {
        return result;
    }

    return new LearningStats({
        userRef: user.id,
        name: categoryName,
        data: getDefaults(categoryName),
    });
}

// TODO
async function updateLearningStatsOfCategory(userInfo: UserInfo, categoryName: string, stats: LearningStats_t) {
    const user = await userLib.findByUserID(userInfo.id);
    if ( !user ) {
        throw new Error(`User missing: ${userInfo.name}`);
    }

    return await LearningStats.findOneAndUpdate(
        {
            userRef: user.id,
            name: categoryName,
        },
        {
            userRef: user.id,
            name: categoryName,
            data: stats,
        },
        {
            upsert: true,
            new: true,
        }
    );
}


async function getWeightsForCategory(userInfo: UserInfo, categoryName: string) {
    const category = await getLearningStatsForCategory(userInfo, categoryName);

    return WeightedRandomTable.fromRightWrongValues(category.data);
}




export default {
    getLearningStatsForCategory,
    getWeightsForCategory,
    updateLearningStatsOfCategory,
};

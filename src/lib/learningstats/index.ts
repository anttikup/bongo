import dbConnect from '../dbconnect'
import userLib from '../../lib/user';
import LearningStats from '../../models/learningstats';

import notenames from './notenames';
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
        case 'notenames':
            return notenames.getDefault();
    }

    if ( categoryName === 'notenames' ) {
        return notenames.getDefault();
    }

    console.dir(categoryName);
    throw new Error(`No such category '${categoryName}', hä? ${typeof categoryName}, ${'notenames'.split('')}`);
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

    console.log("findone result:", result);
    if ( result ) {
        return result;
    }

    console.log("createging new");
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

    console.log("updateLearningStatsOfCategory:", user, userInfo, categoryName);
    console.log("update or insert:", user.id, categoryName);
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

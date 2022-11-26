import dbConnect from '../dbconnect'
import userLib from '../../backendServices/user';
import LearningStats from '../../models/learningstats';

import notenames from './notenames';
import WeightedRandomTable from '../../utils/weightedRandomTable';

import type { DatedValue, LearningStatsItem, StatsCategory, UserDB } from '../../types';


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


async function getLearningStatsForCategory(userInfo, categoryName: string) {
    await dbConnect();
    const user = await userLib.findByUserID(userInfo.id);
    categoryName = categoryName.toString();

    const result = await LearningStats.findOne(
        {
            userRef: user._id,
            name: categoryName,
        }
    );

    console.log("findone result:", result);
    if ( result ) {
        return result;
    }

    console.log("createging new");
    return new LearningStats({
        userRef: user._id,
        name: categoryName,
        data: getDefaults(categoryName),
    });
}

// TODO
async function updateLearningStatsOfCategory(userInfo, categoryName, stats) {
    const user = await userLib.findByUserID(userInfo.id);

    console.log("updateLearningStatsOfCategory:", user, userInfo, categoryName);
    console.log("update or insert:", user._id.toString(), categoryName);
    try {
        return await LearningStats.findOneAndUpdate(
            {
                userRef: user._id.toString(),
                name: categoryName,
            },
            {
                userRef: user._id,
                name: categoryName,
                data: stats,
            },
            {
                upsert: true,
                new: true,
            }
        );
    } catch ( err ) {
        console.error(err.message);
        throw err;
    }
}


async function getWeightsForCategory(userInfo, categoryName) {
    const category = await getLearningStatsForCategory(userInfo, categoryName);

    return WeightedRandomTable.fromRightWrongValues(category.data);
}




export default {
    getLearningStatsForCategory,
    getWeightsForCategory,
    updateLearningStatsOfCategory,
};

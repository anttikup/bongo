import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import { unstable_getServerSession } from "next-auth/next";

import { authOptions } from "../../../auth/[...nextauth]";
import dbcache from '../../../util/dbcache';
import { makeFilterFirstNOrLess } from '../../../util/misc';
import random from '../../../util/random';
import { AudioMeta, PitchMeta, ImageMeta, NoteImage } from '../../../sharedTypes';
import { MAX_HEALTH } from '../../../../../config';

import learningStatsLib from '../../../../../lib/learningstats';

import {
    ImageOption,
    MultipleChoiceAssignment,
    TextOption,
    UserInfo,
} from '../../../../../types';


const generateExercise = async (user: UserInfo) => {
    const questionTypes: ((user: UserInfo) => Promise<MultipleChoiceAssignment>)[] = [
        (user: UserInfo) => generateNameARelatedNoteHalfSteps(user),
    ];

    const genFunctions = random.pickKWithDuplicates(questionTypes, 5 + MAX_HEALTH);

    const exerciseSet = [];
    for ( let genFunc of genFunctions ) {
        exerciseSet.push(await genFunc(user));
    }

    return exerciseSet;

    /* return = await Promise.all(arr.map(async (func): Promise<ExerciseSet> => {
     *     return await func(user);
     * })); */
};



const generateNameARelatedNoteHalfSteps = async (user: UserInfo) : Promise<MultipleChoiceAssignment> => {
    const notesByHalfSteps = ['c', 'cis', 'd', 'dis', 'e', 'f', 'fis', 'g', 'gis', 'a', 'ais', 'b'];
    const notenamePoolAll = await learningStatsLib
        .getWeightsForCategory(user, 'notenames');

    console.log("GOT POOL ********************************************************\n", notenamePoolAll);
    const notenamePool = notenamePoolAll
        .getSubset(['c', 'd', 'e', 'f', 'g', 'a', 'b']);


    const pool = notenamePool.chooseMany(5);
    const [compared, correct] = random.pickK(pool, 2);
    const options = pool.filter(herring => herring !== compared);

    // cmp cor   dist
    // d - e   = -2 => e is [2 above, 10 below] d
    // e - d   =  2 => d is [10 above, 2 below] e
    // d - a   = -7 => a is [7 above, 5 below] d
    // a - d   =  7 => d is [5 above, 7 below] a
    const dist = notesByHalfSteps.indexOf(compared) - notesByHalfSteps.indexOf(correct);
    //const direction = random.getBoolean() ? "above" : "below";
    const direction = (12 - dist) % 12 < (12 + dist) % 12 ? "above" : "below";
    const distInDirection = direction === "above" ? (12 - dist) % 12 : (12 + dist) % 12;

    return {
        type: 'multiplechoice',
        question: {
            text: `Pick the note name that is <strong>${distInDirection} halfsteps ${direction} ${compared}</strong>`,
        },
        answer: correct,
        options: options.map<TextOption>(
            option => ({
                value: option,
                text: option
            })
        ),
        updateStats: ['notenames'],
        id: uuidv4(),
    };
};




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await unstable_getServerSession(req, res, authOptions);
    if ( !session ) {
        res.status(401).json({ error: `You are not authorized to access this content` });
        return;
    }

    const user = session.user;
    if ( ! user ) {
        res.status(401).json({ error: 'invalid user' });
        return;
    }

    res.status(200).json(await generateExercise(user as UserInfo));
};

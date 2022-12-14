// {
//     "tier": 2,
//     "pos": 3,
//     "subtitle": "Basic Intervals",
//     "image": "/images/icons/694-guitar.svg",
//     "color": "cffbcc"
// }

import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import { unstable_getServerSession } from "next-auth/next";

import { authOptions } from "../../../auth/[...nextauth]";
import dbcache from '../../../../../lib/dbcache';
import { makeFilterFirstNOrLess } from '../../../../../lib/misc';
import random from '../../../../../lib/random';
import { MAX_HEALTH } from '../../../../../config';
import learningStatsLib from '../../../../../lib/learningstats';

import {
    StatType,
} from '../../../../../types';

import type {
    AudioMeta,
    PitchMeta,
    ImageMeta,
    NoteImage,
    ImageOption,
    MultipleChoiceAssignment,
    GuitarFretboardAssignment,
    Assignment,
    TextOption,
    UserInfo,
} from '../../../../../types';



const generateExercise = async (user: UserInfo) => {
    const questionTypes: ((user: UserInfo) => Promise<Assignment>)[] = [
        (user: UserInfo) => generateSelectIntervalOnFretboard(user),
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



const generateSelectIntervalOnFretboard = async (user: UserInfo) : Promise<GuitarFretboardAssignment> => {
    const intervalPool = [
        {
            name: 'higher perfect 5th',
            string: -1,
            fret: +2,
        },
        {
            name: 'lower 4th',
            string: +1,
            fret: 0,
        },
        {
            name: 'higher minor 3th',
            string: 0,
            fret: +3,
        },
        {
            name: 'higher major 3th',
            string: -1,
            fret: -1,
        }
    ];

    const main = {
        id: 'master',
        string: 5,
        fret: 5,
        text: 'o',
        color: 'black',
        selectable: false,
    };

    const chosen = random.pickOne(intervalPool);
    const correct = `${main.string + chosen.string}-${main.fret + chosen.fret}`;

    return {
        type: 'guitarfretboard',
        question: {
            text: `Pick the <strong>${chosen.name}</strong> interval`,
        },
        answer: correct,
        main: { string: main.string, fret: main.fret },
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

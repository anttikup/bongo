import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from "next-auth/next";

import { authOptions } from "../../auth/[...nextauth]";
import learningStatsLib from '../../../../lib/learningstats';
import { isNumber, parseNumberField } from '../../util/typeutil';

import type { LearningStats, LearningStatsItem } from '../../../../types';
import { isObject } from '../../../../types';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { category } = req.query;

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

    switch ( method ) {
        case 'GET':
            res.status(200).json(
                await learningStatsLib.getLearningStatsForCategory(user, category.toString())
            );
            break;

        case 'PUT':
            try {
                const parsedStats = parseLearningStats(req.body);
                console.log("PUT: parsed stats", parsedStats);
                const updatedStats = await learningStatsLib.updateLearningStatsOfCategory(user, category.toString(), parsedStats);
                res.status(200).send(updatedStats);
            } catch (err) {
                res.status(400).send({
                    error: err.message
                });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
};


const parseLearningStats = (val: unknown): LearningStats => {
    if ( typeof val !== "object" || val === null ) {
        throw new Error('Incorrect or missing value');
    }

    const map = new Map();
    for ( let key in val ) {
        map.set(key, parseLearningStatsItem(val[key]));
    }

    return map;
};


const isLearningStatsItem = (val: unknown): val is LearningStatsItem => {
    if ( isObject(val) && ('right' in val) && ('wrong' in val) ) {
        return true;
    }

    return false;
};


const parseLearningStatsItem = (val: unknown): LearningStatsItem => {
    if ( isLearningStatsItem(val) ) {
        return {
            right: parseNumberField(val.right, 'right'),
            wrong: parseNumberField(val.wrong, 'wrong'),
        };
    } else {
        throw new Error("Incorrect or missing value");
    }
};

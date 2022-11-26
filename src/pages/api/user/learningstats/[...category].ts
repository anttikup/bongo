import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from "next-auth/next";

import { authOptions } from "../../auth/[...nextauth]";
import learningStatsLib from '../../../../lib/learningstats';
import { parseString, parseNumber } from '../../util/typeutil';

import type { LearningStatsItem } from '../../../../types';


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


const parseLearningStats = (val: unknown): Map<string, LearningStatsItem> => {
    if ( typeof val !== "object" || val === null ) {
        throw new Error('Incorrect or missing value');
    }

    const map = new Map();
    for ( let key in val ) {
        map.set(key, parseLearningStatsItem(val[key]));
    }

    return map;
};

const parseLearningStatsItem = (val: unknown): LearningStatsItem => {
    if ( typeof val !== "object" || val === null ) {
        throw new Error('Incorrect or missing value');
    }

    if ( !val['right'] || !val['wrong'] ) {
        throw new Error('Incorrect or missing value');
    }

    return {
        right: parseNumber(val.right),
        wrong: parseNumber(val.wrong),
    };
};

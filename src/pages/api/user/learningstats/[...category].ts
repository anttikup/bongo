import { NextApiRequest, NextApiResponse } from 'next';

import sessionLib from '../../../../lib/session';
import learningStatsLib from '../../../../lib/learningstats';
import { getErrorMessage } from '../../../../lib/error';
import { parseLearningStats } from '../../../../lib/typeparsers';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method, query } = req;
    const category = query?.category?.toString();

    if ( !category ) {
        res.status(401).json({ error: 'missing category' });
        return;
    }

    const user = await sessionLib.getCurrentUser(req, res);
    if ( !user ) {
        res.status(401).json({ error: `You are not authorized to access this content` });
        return;
    }

    switch ( method ) {
        case 'GET':
            try {
                res.status(200).json(
                    await learningStatsLib.getLearningStatsForCategory(user, category)
                );
            } catch (err) {
                res.status(400).send({
                    error: getErrorMessage(err)
                });
            }
            break;

        case 'PUT':
            try {
                const parsedStats = parseLearningStats(req.body);
                const updatedStats = await learningStatsLib.updateLearningStatsOfCategory(user, category, parsedStats);
                res.status(200).send(updatedStats);
            } catch (err) {
                res.status(400).send({
                    error: getErrorMessage(err)
                });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
};

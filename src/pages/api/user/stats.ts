import { NextApiRequest, NextApiResponse } from 'next';

import sessionLib from '../../../lib/session';
import userLib from '../../../lib/user';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    const user = await sessionLib.getCurrentUser(req, res);
    if ( !user ) {
        res.status(401).json({ error: `You are not authorized to access this content` });
        return;
    }

    switch ( method ) {
        case 'GET':
            res.status(200).json(await userLib.getStats(user));
            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
};

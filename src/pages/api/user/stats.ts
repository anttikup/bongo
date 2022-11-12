import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";
import userService from '../../../backendServices/user';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

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
            res.status(200).json(userService.getStats());
            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
};

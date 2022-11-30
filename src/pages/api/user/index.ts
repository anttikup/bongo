import { NextApiRequest, NextApiResponse } from 'next';

import sessionLib from '../../../lib/session';
import userLib from '../../../lib/user';
import { getErrorMessage } from '../../../lib/error';
import { parseUserFields } from '../../../lib/typeparsers';
import { assert } from '../../../lib/debug';

import { isObject, isNumber } from '../../../types';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    const user = await sessionLib.getCurrentUser(req, res);
    if ( !user ) {
        res.status(401).json({ error: `You are not authorized to access this content` });
        return;
    }

    switch ( method ) {
        case 'GET':
            try {
                const userData = await userLib.findOrCreateUserByUserInfo(user);
                res.status(200).json(userData);
            } catch ( err ) {
                res.status(400).send({
                    error: getErrorMessage(err)
                });
            }
            break;

        case 'PATCH':
            try {
                const fieldsToUpdate = parseUserFields(req.body);
                if ( isXpField(fieldsToUpdate) ) {
                    const updatedUser = await userLib.updateXP(user, fieldsToUpdate.xp);
                    res.json(updatedUser);
                } else {
                    throw new Error('not implemented');
                }
            } catch ( err ) {
                res.status(400).send({
                    error: getErrorMessage(err)
                });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PATCH'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
};


type XpField = {
    xp: number;
};

const isXpField = (obj: unknown): obj is XpField => {
    if ( isObject(obj) && 'xp' in obj && Object.keys(obj).length === 1 && isNumber(obj.xp) ) {
        return true;
    }
    return false;
};

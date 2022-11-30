import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";
import userLib from '../../../lib/user';

import { isObject } from '../../../types';
import { parseStringField, parseIntegerField } from '../util/typeutil';

import type { UserDB, UserInfo } from '../../../types';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    const session = await unstable_getServerSession(req, res, authOptions);
    if ( !session ) {
        res.status(401).json({ error: `You are not authorized to access this content` });
        return;
    }

    const userInfo = session.user;
    if ( ! userInfo ) {
        res.status(401).json({ error: 'invalid user' });
        return;
    }

    console.log("SESSION USER:", userInfo);
    console.log("SESSION:", session);

    const userObj = await userLib.findOrCreateUserByUserInfo(userInfo as UserInfo);
    if ( ! userObj ) {
        res.status(404).json({ error: `invalid user ${userInfo.name}` });
        return;
    }

    switch ( method ) {
        case 'GET':
            res.status(200).json(userObj);
            break;

        case 'PATCH':
            try {
                const fieldsToUpdate = parseUserFields(req.body);
                console.assert(Object.keys(fieldsToUpdate).length === 1, "can only set xp");
                console.assert('xp' in fieldsToUpdate, "can only set xp");
                console.log("udpate user, fields:", fieldsToUpdate);
                const updatedUser = await userLib.updateXP(userInfo as UserInfo, fieldsToUpdate['xp'] || 0);
                console.log("  result:", updatedUser);
                res.json(updatedUser);
            } catch ( err ) {
                if ( isObject(err) && 'message' in err ) {
                    res.status(400).send({
                        error: err.message
                    });
                } else {
                    throw err;
                }
            }
            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
};


type UserFields = Partial<UserDB>;

export const parseUserFields = (fields: Record<string, unknown>): UserFields => {
    const userFields: UserFields = {
        username: fields.username ? parseStringField(fields.username, "username") : undefined,
        xp: fields.xp ? parseIntegerField(fields.xp, "xp") : undefined ,
    }

    return userFields;
};

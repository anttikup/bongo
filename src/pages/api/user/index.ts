import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";
import userService from '../../../backendServices/user';

import * as util from 'util' // has no default export
const circularReference = {otherData: 123};
circularReference.myself = circularReference;

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};


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

    const userObj = await userService.findOrCreateUserByUserInfo(userInfo);
    if ( ! userObj ) {
        res.status(404).json({ error: `invalid user ${userInfo.name}` });
        return;
    }

    switch ( method ) {
        case 'GET':
            res.status(200).json(userObj);
            //res.status(200).json(JSON.parse(JSON.stringify(session, getCircularReplacer())));
            //res.status(200).json(JSON.parse(JSON.stringify(req, getCircularReplacer())));
            //res.json(userInfo);
            //res.json(session);

            break;

        case 'PATCH':
            try {
                const fieldsToUpdate = parseUserFields(req.body);
                console.log("udpate user, fields:", fieldsToUpdate);
                const updatedUser = await userService.updateUser(userInfo, fieldsToUpdate);
                console.log("  result:", updatedUser);
                res.json(updatedUser);
            } catch (err) {
                res.status(400).send({
                    error: err.message
                });
            }
            break;

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
};


type UserFields = Partial<UserBackend>;

export const parseUserFields = (fields: Record<string, unknown>): UserFields => {
    const userFields: UserFields = {
        username: fields.username ? parseStringField(fields.username, "username") : undefined,
        xp: fields.xp ? parseIntegerField(fields.xp, "xp") : undefined ,
    }

    return userFields;
};

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const parseStringField = (text: unknown, fieldName: string): string => {
    if ( !text || !isString(text) ) {
        throw new Error(`Incorrect or missing string in field '${fieldName}': ${text}`);
    }

    return text;
}

const isNumber = (val: unknown): val is number => {
    return typeof val === 'number' || val instanceof Number;
};

export const parseNumber = (val: unknown): number => {
    if (!val || !isNumber(val)) {
        throw new Error('Incorrect or missing number');
    }

    return val;
}

const parseIntegerField = (val: unknown, fieldName: string): number => {
    if ( !isNumber(val) ) {
        throw new Error(`Incorrect or missing val in field ${fieldName}: ${val}`);
    }

    return val;
};

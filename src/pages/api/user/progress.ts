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
            res.status(200).json(userService.getProgress(user));
            break;

        case 'PATCH':
            try {
                console.log("BODY:", req.body);
                const itemsToUpdate = parseUserProgressFields(req.body);
                console.log("items to udpate", itemsToUpdate);
                const updatedProgress = userService.updateProgress(user, itemsToUpdate);
                res.status(200).json(updatedProgress);
            } catch (err) {
                res.status(400).send({
                    error: err.message
                });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'PATCH'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
};


type Val = {
    val: string | number;
};

type ProgressFields = Partial<UserProgress>;

const parseUserProgressFields = (fields: Record<string, Val>): ProgressFields => {
    const progressFields: ProgressFields = {
    }

    for ( let key in fields ) {
        console.log("key:", key);
        console.log("    :", fields[key].val);
        progressFields[key] = { val: parseIntegerField(fields[key].val, key) };
    }

    return progressFields;
};


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

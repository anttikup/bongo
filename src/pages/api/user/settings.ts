import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";
import userLib from '../../../lib/user';
import { parseBooleanField, parseStringField, parseIntegerField } from '../util/typeutil';

import type { UserSettings, NotenamePreference } from '../../../types';


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
        case 'GET': {
            const userData = await userLib.findByUserID(user.id);
            delete userData.xp;
            delete userData.xpHistory;
            delete userData.progress;
            res.status(200).json(userData);
            break;
        }
        case 'PATCH':
            try {
                const itemsToUpdate = parseUserFields(req.body);
                console.log("settings items to udpate", itemsToUpdate);
                const updatedProgress = await userLib.updateUser(user, itemsToUpdate);
                console.log("updated in api:", updatedProgress);
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


type UserFields = Partial<UserSettings>;

export const parseUserFields = (fields: Record<string, unknown>): UserFields => {
    const userFields: UserFields = {
        username: fields.username ? parseStringField(fields.username, 'username') : undefined,
        email: fields.email ? parseStringField(fields.email, 'email') : undefined,
        notenamePreference: fields.notenamePreference
                          ? parseNotenamePreferenceField(fields.notenamePreference, 'notenamePreference')
                          : undefined,
        noAudioExercises: fields.noAudioExercises
                        ? parseBooleanField(fields.noAudioExercises, 'noAudioExercises')
                        : undefined,
        noImageExercises: fields.noImageExercises
                        ? parseBooleanField(fields.noImageExercises, 'noImageExercises')
                        : undefined,
        noMicrophoneExercises: fields.noMicrophoneExercises
                             ? parseBooleanField(fields.noMicrophoneExercises, 'noMicrophoneExercises')
                             : undefined,
    }

    return userFields;
};



const parseNotenamePreferenceField = (o: unknown, fieldName: string): NotenamePreference => {
    if ( o !== 'b' && o !== 'h' && o !== 'si' ) {
        throw new Error(`Incorrect or missing boolean in field '${fieldName}': ${o}`);
    }

    return o;
}

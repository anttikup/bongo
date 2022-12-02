import { NextApiRequest, NextApiResponse } from 'next';

import sessionLib from '../../../lib/session';
import userLib from '../../../lib/user';
import { getErrorMessage } from '../../../lib/error';
import { parseUserSettingsFields } from '../../../lib/typeparsers';


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
                const settings = await userLib.getSettings(user);
                res.status(200).json(settings);
            } catch (err) {
                res.status(400).send({
                    error: getErrorMessage(err)
                });
            }
            break;

        case 'PATCH':
            try {
                const itemsToUpdate = parseUserSettingsFields(req.body);
                const updatedUser = await userLib.updateSettings(user, itemsToUpdate);
                res.status(200).json(updatedUser);
            } catch (err) {
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

import { unstable_getServerSession } from "next-auth/next";
import type { NextApiRequest, NextApiResponse } from 'next'

import { authOptions } from "../pages/api/auth/[...nextauth]";
import type { UserInfo } from '../types';


const getCurrentUser = async (req: NextApiRequest, res: NextApiResponse): Promise<UserInfo | null> => {
    const session = await unstable_getServerSession(req, res, authOptions);
    if ( !session ) {
        return null;
    }

    const user = session.user;
    if ( !user ) {
        return null;
    }

    return user;
};


export default {
    getCurrentUser,
};

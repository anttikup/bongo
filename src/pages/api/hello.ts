import { NextApiRequest, NextApiResponse } from 'next';

export default const handler = (req: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ text: 'Hello' });
};

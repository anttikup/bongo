import { NextApiRequest, NextApiResponse } from 'next';

import overviewData from '../../../../earo2/mockbackend/api/overview.json';

const overview: Overview = overviewData as unknown as Overview;

const getEntries = (): Overview => {
    return overview;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(getEntries());
};

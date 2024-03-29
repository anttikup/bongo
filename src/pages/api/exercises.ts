import { NextApiRequest, NextApiResponse } from 'next';

import overviewData from '../../../public/overview.json';

import type { Overview } from '../../types';

const overview: Overview = overviewData as unknown as Overview;

const getEntries = (): Overview => {
    return overview;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json(getEntries());
};

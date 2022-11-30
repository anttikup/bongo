import overviewData from '../../public/overview.json';
import { Overview } from '../types';

const overview: Overview = overviewData as unknown as Overview;

const getOverview = (): Overview => {
    return overview;
};

const getAllExerciseIds = (): string[] => {
    return overviewData.map(tier => {
        return tier.items.map(item => item.id);
    }).flat();
};


export default {
    getOverview,
    getAllExerciseIds,
};

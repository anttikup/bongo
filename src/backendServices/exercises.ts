import overviewData from '../../../earo2/mockbackend/api/overview.json';
import { Overview } from '../types';


const overview: Overview = overviewData as unknown as Overview;

const getOverview = (): Overview => {
    return overview;
};


export default {
    getOverview,
};

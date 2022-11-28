import overviewData from '../../public/overview.json';
import { Overview } from '../types';


const overview: Overview = overviewData as unknown as Overview;

const getOverview = (): Overview => {
    return overview;
};


export default {
    getOverview,
};

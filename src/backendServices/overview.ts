import overviewData from '../../../mockbackend/api/overview.json';
import { Overview } from '../types';


const overview: Overview = overviewData as unknown as Overview;

const getEntries = (): Overview => {
    return overview;
};


export default {
    getEntries,
};

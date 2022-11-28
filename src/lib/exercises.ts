import overviewData from '../../public/overview.json';


export function getAllExerciseIds() {
    return overviewData.map(tier => {
        return tier.items.map(item => item.id);
    }).flat();
};

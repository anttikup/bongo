import overviewData from '../../../../earo2/mockbackend/api/overview.json';


export function getAllExerciseIds() {
    return overviewData.map(tier => {
        return tier.items.map(item => item.id);
    }).flat();
};

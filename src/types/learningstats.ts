export enum StatType {
    Notename = 'notename',
    AbsPIC = 'abspic',
    Cents = 'cents',
    ChordQuality = 'chordQuality',
    IntervalQuality = 'intervalQuality',
}

export type LearningStatsItem = {
    wrong: number;
    right: number;
};

export type LearningStats = Map<string, LearningStatsItem>;


export type StatsCategoryFront = {
    name: string;
    data: LearningStats;
};

export type LearningStatsCategory = {
    userRef: ObjectId;
    name: string;
    data: LearningStats;
};

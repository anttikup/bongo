import mongoose from 'mongoose';
import learningStatsLib from './index.js';

console.log("hello");
(async () => {
    await mongoose.connect('mongodb://localhost:27017/test');


    const statscat = await learningStatsLib.getLearningStatsForCategory({ userId: 49523197 }, 'notenames');
    statscat.data.get('e').wrong += 11;
    statscat.data.get('e').right += 3;
    statscat.data.get('f').wrong += 2;
    statscat.data.get('f').right += 9;
    statscat.data.get('g').wrong += 0;
    statscat.data.get('g').right += 100;

    await statscat.save();


    console.log("GET WEIGTHS LEARNGINGS STATS*********************************");
    const weightsTable = await learningStatsLib.getWeightsForCategory({ userId: 49523197 }, 'notenames');

    const basic = weightsTable.getSubset(['c', 'd', 'e', 'f', 'g', 'a', 'b']);
    console.log("Selection:", basic.chooseMany(5));
})();

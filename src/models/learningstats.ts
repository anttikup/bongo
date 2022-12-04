import mongoose from 'mongoose';
import { LearningStatsCategory as LearningStatsCategory_t } from '../types';

const statsCategorySchema = new mongoose.Schema<LearningStatsCategory_t>({
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        enum: [ "notename", "abspic" ],
    },
    data: {
        type: Map,
        required: true,
        of: {
            right: {
                type: Number,
                required: true,
                default: 1,
            },
            wrong: {
                type: Number,
                required: true,
                default: 1,
            },
        }
    },
}, { timestamps: true });

statsCategorySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

statsCategorySchema.index({ userRef: 1, name: 1 }, { unique: true });

export default (mongoose.models.LearningStatsCategory || mongoose.model('LearningStatsCategory', statsCategorySchema)) as mongoose.Model<LearningStatsCategory_t>;

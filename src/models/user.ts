import mongoose from 'mongoose';

import type { UserDB } from '../types';


const userSchema = new mongoose.Schema<UserDB>({
    userId: String,
    username: String,
    progress: {
        type: Map,
        of: {
            val: Number,
            updated: Date,
        },
        required: true,
    },
    xp: 0,
    xpHistory: {
        type: Map,
        of: Number,
        required: true,
    },
    /* learningStats: [
     *     {
     *         type: mongoose.Schema.Types.ObjectId,
     *         ref: 'LearningStats',
     *     },
     * ], */
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});


userSchema.index({ userID: 1 }, { unique: true });

export default mongoose.model<UserDB>('User', userSchema);

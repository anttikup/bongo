import mongoose from 'mongoose';

import type { UserDB } from '../types';


const userSchema = new mongoose.Schema<UserDB>({
    userId: {
        type: String,
        required: true,
    },
    username: String,
    email: String,
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
    preferences: {
        notenamePreference: {
            type: String,
            enum: ['b', 'h', 'si'],
        },
        reminderEnabled: Boolean,
        noAudioExercises: Boolean,
        noImageExercises: Boolean,
        noMicrophoneExercises: Boolean,
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


userSchema.index({ userId: 1 }, { unique: true });

export default (mongoose.models.User || mongoose.model<UserDB>('User', userSchema)) as mongoose.Model<UserDB>;

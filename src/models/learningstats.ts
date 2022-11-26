import mongoose from 'mongoose';

const statsCategorySchema = new mongoose.Schema({
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
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
});

statsCategorySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

statsCategorySchema.index({ userRef: 1, name: 1 }, { unique: true });

//export default statsCategorySchema;
export default mongoose.models.LearningStats || mongoose.model('LearningStats', statsCategorySchema);

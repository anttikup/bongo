import { State } from "./state";
import { ExerciseProgress, UIMessage, User, UserProgress } from "../types";

export type Action =
    | {
        type: "SET_MESSAGE";
        object: UIMessage | null;
    }
    | {
        type: "SET_EXCERCISE_PROGRESS";
        object: {
            id: string;
            progress: ExerciseProgress;
        };
    }
    | {
        type: "SET_USER";
        object: User | null;
    }
    | {
        type: "SET_USER_PROGRESS";
        object: UserProgress;
    }
    | {
        type: "SET_EXPERIENCE";
        object: number;
    };


export const setMessage = (message: UIMessage | null): Action => {
    return { type: "SET_MESSAGE", object: message };
};


export const setExerciseProgress = (id: string, progress: ExerciseProgress): Action => {
    return { type: "SET_EXCERCISE_PROGRESS", object: { id, progress } };
};

export const setUser = (user: User | null): Action => {
    return { type: "SET_USER", object: user };
};

export const setUserProgress = (userProgress: UserProgress): Action => {
    return { type: "SET_USER_PROGRESS", object: userProgress };
};

export const setExperience = (xp: number): Action => {
    return { type: "SET_EXPERIENCE", object: xp };
};


export const reducer = (state: State, action: Action): State => {
    switch (action.type) {

        case "SET_EXCERCISE_PROGRESS": {
            const obj = action.object;
            const id = obj.id;
            const progress = obj.progress;
            const newUserProgress = { ...state.userProgress, [id]: progress };
            return {
                ...state,
                userProgress: newUserProgress
            };
        }

        case "SET_MESSAGE":
            return {
                ...state,
                message: action.object
            };

        case "SET_USER":
            return {
                ...state,
                user: action.object
            };

        case "SET_USER_PROGRESS":
            return {
                ...state,
                userProgress: action.object
            };

        case "SET_EXPERIENCE":
            return {
                ...state,
                experience: action.object
            };

        default:
            return state;
    }

};

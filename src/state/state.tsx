import React, { createContext, useContext, useReducer } from "react";
import { User, UserProgress } from "../types";

import { Action } from "./reducer";

export type State = {
    user: User | null;
    experience: number;
    userProgress: UserProgress;
};

const initialState: State = {
    user: null,
    experience: 0,
    userProgress: {},
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};
export const useStateValue = () => useContext(StateContext);

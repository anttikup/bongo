import { setMessage, useStateValue } from "../state";


export function useMessage() {
    const [{ message }, dispatch] = useStateValue();

    const exportedSetMessage = newMessage => {
        dispatch(setMessage(newMessage));
    };
    return [message, exportedSetMessage] as const;
};

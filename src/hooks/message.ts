import { setMessage, useStateValue } from "../state";

import { UIMessage } from "../types";


export function useMessage() {
    const [{ message }, dispatch] = useStateValue();

    const exportedSetMessage = (newMessage: UIMessage | null) => {
        dispatch(setMessage(newMessage));
    };
    return [message, exportedSetMessage] as const;
};

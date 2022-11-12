import { useMessage } from './message';

export function useErrorMessage() {
    const [_, setMessage] = useMessage(null);
    const setErrorMessage = (title, text) => {
        console.log("set error", title);
        if ( title || text ) {
            setMessage({ type: "error", title, text });
        }
    };

    return [setErrorMessage];
};

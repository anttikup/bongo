import { useMessage } from './message';

export function useErrorMessage() {
    const [_, setMessage] = useMessage();
    const setErrorMessage = (title: string, text: string) => {
        if ( title || text ) {
            setMessage({ type: "error", title, text });
        }
    };

    return [setErrorMessage] as const;
};

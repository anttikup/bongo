import { useMessage } from './message';

export function useErrorMessage() {
    const [_, setMessage] = useMessage();
    const setErrorMessage = (title: string | null, text?: string) => {
        if ( title && text ) {
            setMessage({ type: "error", title, text });
        } else {
            setMessage(null);
        }
    };

    return [setErrorMessage] as const;
};

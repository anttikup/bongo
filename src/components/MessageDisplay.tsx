import { useEffect, useRef } from 'react';
import { Message } from 'semantic-ui-react';

import { useMessage } from '../hooks/message';

import styles from '../styles/MessageDisplay.module.css';

import { UIMessage } from '../types';



type Props = {
};

const MessageDisplay = (props: Props) => {
    const [message, setMessage] = useMessage();
    const elementRef = useRef(null);

    useEffect(() => {
        elementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const handle = setTimeout(() => {
            setMessage(null);
        }, 8000);

        return () => {
            if ( handle ) {
                clearTimeout(handle);
            }
        };
    }, [message]);

    if ( message === null ) {
        return null;
    }


    return (
        <div ref={elementRef} className={styles.message}>
            <Message negative={message.type === "error"} positive={message.type === "success"}>
                <Message.Header>{message.title}</Message.Header>
                <p>{message.text}</p>
            </Message>
        </div>
    );
};

export default MessageDisplay;

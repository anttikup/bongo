import { useEffect, useRef } from 'react';
import { Message } from 'semantic-ui-react';

import { useMessage } from '../hooks/message';

import { UIMessage } from '../types';


type Props = {
};

const MessageDisplay = (props: Props) => {
    const [message, setMessage] = useMessage();
    const myRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            setMessage(null);
        }, 8000);
    }, [message]);

    if ( message === null ) {
        return null;
    }


    return (
        <div ref={myRef}>
            <Message negative={message.type === "error"} positive={message.type === "success"}>
                <Message.Header>{message.title}</Message.Header>
                <p>{message.text}</p>
            </Message>
        </div>
    );
};

export default MessageDisplay;

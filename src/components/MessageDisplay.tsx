import React from 'react';
import { useEffect, useRef } from 'react';
import { Message as MessageComponent } from 'semantic-ui-react';

import { useMessage } from '../hooks/message';

import { Message as MessageType } from '../types';


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
            <MessageComponent negative={message.type === "error"} positive={message.type === "success"}>
                <MessageComponent.Header>{message.title}</MessageComponent.Header>
                <p>{message.text}</p>
            </MessageComponent>
        </div>
    );
};

export default MessageDisplay;

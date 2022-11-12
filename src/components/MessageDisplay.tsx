import React from 'react';
import { useEffect } from 'react';
import { Message as MessageComponent } from 'semantic-ui-react';

import { useMessage } from '../hooks/message';

import { Message as MessageType } from '../types';


type Props = {
};

const MessageDisplay = (props: Props) => {
    const [message, setMessage] = useMessage();
    console.log("message:", message);

    useEffect(() => {
        setTimeout(() => {
            setMessage(null);
        }, 8000);
    }, [message]);


    if ( message === null ) {
        return null;
    }


    return (
        <MessageComponent negative={message.type === "error"} positive={message.type === "success"}>
            MESSAGE:
            <MessageComponent.Header>{message.title}</MessageComponent.Header>
            <p>{message.text}</p>
        </MessageComponent>
    );
};

export default MessageDisplay;

import { Message } from 'semantic-ui-react';

import style from '../styles/Error.module.css';

const Error = ({ message } : { message: string; }) => {
    return (
        <Message negative>
            <Message.Header>Error</Message.Header>
            <p>
                {message}
            </p>
        </Message>
    );
};

export default Error;

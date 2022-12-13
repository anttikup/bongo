import Router from 'next/router';
import { Button, Icon } from 'semantic-ui-react';

import style from '../styles/CallToAction.module.css';


type CallToActionProps = {
    href: string;
};

const CallToAction = ({ href }: CallToActionProps) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        Router.push(href);
    };

    return (
        <div className={style.main}>
            <p className={style.compartment1}>
                Practice this topic
            </p>
            <p className={style.compartment2}>
                <Button className={style.actionButton} primary onClick={handleClick}>Start <Icon name="arrow circle right"/></Button>
            </p>
        </div>
    );
};

export default CallToAction;

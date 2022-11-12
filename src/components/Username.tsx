import React from 'react';

import styles from '../styles/Username.module.css';

type UsernameProps = {
    name: string | null;
};

const Username = ({ name }: UsernameProps) => {

    return (
        <span className={styles.usernameDisplay}>{name}</span>
    );
};

export default Username;

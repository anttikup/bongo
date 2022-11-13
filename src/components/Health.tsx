import React from 'react';
import { Icon, Rating } from "semantic-ui-react";

import styles from '../styles/Health.module.css';

type HealthProps = {
    max: number;
    value: number;
};

const Health = ({ max, value }: HealthProps) => {
    return (
        <Rating className={styles.health} icon="heart" maxRating={max} rating={value} />
    );
};

export default Health;

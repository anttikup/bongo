import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Icon } from "semantic-ui-react";

import styles from '../styles/ExpPoints.module.css';

type ExpPointsProps = {
    points: number;
};

const ExpPoints = ({ points }: ExpPointsProps) => {
    const [effectStarted, setEffectStarted] = useState(false);
    useEffect(() => {
        console.log("points before", points);
        if ( !points ) {
            return;
        }
        console.log("  effect");
        setEffectStarted(true);
        window.setTimeout(() => {
            setEffectStarted(false);
        }, 100);
    }, [points]);

    return (
        <span title="Experience points" className={`${styles.expPoints} ${effectStarted ? styles.powerup : styles.normal}`}>
            <Icon className={styles.icon} name="star" color="yellow"/> {points}
            </span>
    );
};

export default ExpPoints;

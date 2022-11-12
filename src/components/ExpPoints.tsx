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
        if ( points === 0 ) {
            return;
        }
        setEffectStarted(true);
        window.setTimeout(() => {
            setEffectStarted(false);
        }, 100);
    }, [points]);

    return (
        <span id="exp-points" title="Experience points" className={effectStarted ? styles.powerup : styles.normal}>
            <Icon name="star" color="yellow"/> {points}
        </span>
    );
};

export default ExpPoints;

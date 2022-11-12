import React from 'react';
import { Button } from 'semantic-ui-react';

import style from '../styles/ButtonBar.module.css';
import { Phase } from '../types';

type ButtonBarProps = {
    checkDisabled: boolean;
    skipDisabled: boolean;
    phase: Phase;
    onCheck: () => void;
    onNext: () => void;
    onSkip: () => void;
    onExit: () => void;
};

const ButtonBar = ({ checkDisabled, skipDisabled, phase, onCheck, onNext, onSkip, onExit }: ButtonBarProps) => {
    switch ( phase ) {
        case Phase.Question:
            return (
                <div className={style.buttonBar}>
                    <Button primary disabled={checkDisabled} onClick={onCheck}>Check</Button>{' '}
                    <Button secondary disabled={skipDisabled} onClick={onSkip}>Skip</Button>
                </div>);
        case Phase.Check:
            return (
                <div className={style.buttonBar}>
                    <Button primary onClick={onNext}>Next</Button>
                </div>);
        case Phase.LastCheck:
            return (
                <div className={style.buttonBar}>
                    <Button primary onClick={onNext}>Finish</Button>
                </div>);
        case Phase.Results:
            return (
                <div className={style.buttonBar}>
                    <Button primary onClick={onExit}>OK</Button>
                </div>);
    }
};

export default ButtonBar;

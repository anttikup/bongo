import { useEffect } from 'react';
import { Icon } from "semantic-ui-react";

import StatusCardLayout from './StatusCardLayout';
import { setExperience, useStateValue } from "../state";

import style from '../styles/StatusCard.module.css';


export enum StatusValue {
    Correct,
    Wrong,
    Upgraded,
    Failed,
}

type StatusProps = {
    type: StatusValue;
    assignXP?: number;
};



const StatusCard = ({ type, assignXP }: StatusProps) => {
    const loadAudio = (type: string) => {
        switch ( type ) {
            case 'correct':
                return new Audio('/effects/correct.mp3');
            case 'wrong':
                return new Audio('/effects/wrong.mp3');
            case 'succeed':
                return new Audio('/effects/success.mp3');
            case 'fail':
                return new Audio('/effects/failure.mp3');
        }
        return null;
    };


    const playEffect = (type: string) => {
        const elem = loadAudio(type);
        if ( elem ) {
            elem.addEventListener("canplaythrough", () => {
                void elem.play();
            });
        }
    };


    useEffect(() => {
        switch ( type ) {
            case StatusValue.Correct:
                playEffect('correct');
                break;
            case StatusValue.Wrong:
                playEffect('wrong');
                break;
            case StatusValue.Upgraded:
                playEffect('succeed');
                break;
            case StatusValue.Failed:
                playEffect('fail');
                break;
        }
    }, [type]);


    return (
        <div className="status-area">
            { (function () {
                  switch ( type ) {
                      case StatusValue.Correct:
                          return (
                              <StatusCardLayout image="check">Correct <i>!</i></StatusCardLayout>
                          );
                      case StatusValue.Wrong:
                          return (
                              <StatusCardLayout image="cross">Wrong <i>!</i></StatusCardLayout>
                          );
                      case StatusValue.Upgraded:
                          return (
                              <StatusCardLayout image="check">Congrats, <br/>+{assignXP} <Icon name="star" color="yellow"/><i>!</i></StatusCardLayout>
                          );
                      case StatusValue.Failed:
                          return (
                              <StatusCardLayout image="cross">Better luck <br/>next time <i>!</i></StatusCardLayout>
                          );
                  }
              }()) }
        </div>
    );
};

export default StatusCard;

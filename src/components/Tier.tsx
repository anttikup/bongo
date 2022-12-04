import React from 'react';
import { Segment } from "semantic-ui-react";

import { ExerciseDescr } from "../types";
import { useStateValue } from "../state";
import Box from "./Box";
import style from '../styles/Tier.module.css';

type TierProps = {
    boxes: ExerciseDescr[];
};

const Tier = ({ boxes }: TierProps) => {
    const [{ userProgress }, ] = useStateValue();

    return (
        <div className={style.tier}>
            { boxes.map((item, index) => (
                <Box
                    key={item.id}
                    topic={item.topic}
                    level={item.level}
                    title={item.title}
                    subtitle={item.subtitle}
                    progress={userProgress[item.id] ? userProgress[item.id].val : 0}
                    refreshed={userProgress[item.id]?.updated}
                    color={item.color}
                    image={item.image}
                    hasLecture={item.hasLecture}
                />
            )) }
        </div>
    );
};

export default Tier;

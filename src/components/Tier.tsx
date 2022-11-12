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

    console.log("userProgress:", userProgress);
    return (
        <Segment className={style.tier}>
            { boxes.map((item, index) => (
                <Box
                    key={index}
                    topic={item.topic}
                    level={item.level}
                    progress={userProgress[item.id] ? userProgress[item.id].val : 0}
                    color={item.color}
                    text={item.text}
                    image={item.image}
                    material={item.material}
                    levels={item.levels}
                />
            )) }
        </Segment>
    );
};

export default Tier;

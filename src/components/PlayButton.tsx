import { useState } from 'react';
import { Button, Icon } from "semantic-ui-react";

import style from '../styles/PlayButton.module.css';


type Props = {
    src: string;
    [x:string]: unknown;
};

const PlayButton = (props: Props) => {
    const { src } = props;
    const [playing, setPlaying] = useState(false);

    const playAudio = () => {
        const elem = new Audio(src);
        elem.addEventListener("canplaythrough", () => {
            void elem.play();
        });
        elem.addEventListener("ended", () => {
            setPlaying(false);
        });
        setPlaying(true);
    };

    const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        playAudio();
    };

    const keyPressed = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
        if ( ["Enter", " "].includes(event.key) ) {
            event.preventDefault();
            event.stopPropagation();
            playAudio();
        }
    };

    return (
        <Button {...props } className={`${style.playButton} ${props.className}`} onClick={onClick} onKeyPress={keyPressed}>
            <Icon name={!playing ? 'play' : 'volume up'} />
        </Button>
    );
};

export default PlayButton;

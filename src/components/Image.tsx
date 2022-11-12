import React from 'react';

import style from '../styles/Image.module.css';


type ImageProps = {
    name: string;
};

const Image = ({ name }: ImageProps) => {

    const src = (() => {
        switch ( name ) {
            case 'check':
                return "https://upload.wikimedia.org/wikipedia/commons/f/fb/Yes_check.svg";
            case 'cross':
                return "https://upload.wikimedia.org/wikipedia/commons/4/48/Dark_Red_x.svg";
        }
        throw new Error(`unknown name ${name}`);
    })();

    return (
        <img className={style.image} src={src} />
    );
};

export default Image;

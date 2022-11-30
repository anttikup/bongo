import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Progress } from 'semantic-ui-react';

import style from '../styles/Box.module.css';


type BoxProps = {
    progress: number;
    text: string;
    image: string;
    color: string;
    topic: string;
    level: number;
    material?: string;
    refreshed?: string;
    levels: number;
};

const Box = ({ progress, refreshed, text, image, color, topic, level, material, levels }: BoxProps) => {
    const [mainHovered, setMainHovered] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        Router.push(`/exercise/${topic}/${level}`);
    };

    const handleMaterialHover = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.stopPropagation();
        event.preventDefault();
        setMainHovered(false);
    };


    const handleMainHover = (event: React.MouseEvent<HTMLDivElement>) => {
        setMainHovered(true);
    };

    const handleMainUnHover = (event: React.MouseEvent<HTMLDivElement>) => {
        setMainHovered(false);
    };

    return (
        <div className={style.overviewBox} style={{backgroundColor: color}}>
            { material
              && <div className={style.materialButtonContainer}>
                  <Link href={material} title="Material" onMouseEnter={handleMaterialHover}>
                      <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Deus_Books.png/240px-Deus_Books.png"
                          alt="Theory"
                          width="32"
                          height="32"
                      />
                  </Link>
              </div>
            }
            <div
                className={`${style.main} ${mainHovered ? style.overviewBoxHover : null}`}
                onMouseEnter={handleMainHover}
                onMouseLeave={handleMainUnHover}
                onClick={handleClick}
                title={`${progress}/${levels}, \nlast refreshed: ${refreshed || 'never'}`}
            >
                <img src={image}/>
                {<Progress value={progress} size="small" total={levels} autoSuccess />}
                <div className={style.boxTitle}>
                    <Link href={`/exercise/${topic}/${level}`}>{text}</Link>
                </div>
            </div>
        </div>
    );
};

export default Box;

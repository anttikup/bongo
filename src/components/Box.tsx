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
};

const Box = ({ progress, text, image, color, topic, level, material, levels }: BoxProps) => {
    const [mainHovered, setMainHovered] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        Router.push(`/exercise/${topic}/${level}`);
    };

    const handleMaterialHover = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.stopPropagation();
        event.preventDefault();
        setMainHovered(false);
    };


    const handleMainHover = (event: React.MouseEvent<HTMLAnchorElement>) => {
        setMainHovered(true);
    };

    const handleMainUnHover = (event: React.MouseEvent<HTMLAnchorElement>) => {
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
                title="Practice"
                title={`${progress}/${levels}`}
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

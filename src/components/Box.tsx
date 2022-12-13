import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { Progress } from 'semantic-ui-react';
import { formatDistance } from 'date-fns';

import style from '../styles/Box.module.css';


type BoxProps = {
    progress: number;
    topic: string;
    level: number;
    title: string;
    subtitle?: string;
    image: string;
    color: string;
    hasLecture?: boolean;
    refreshed?: string;
};

const Box = ({ progress, refreshed, title, subtitle, image, color, topic, level, hasLecture }: BoxProps) => {
    const [mainHovered, setMainHovered] = useState(false);

    // Direct first to lecture, if exercise is never done
    const linkTarget = refreshed || !hasLecture ? `/exercise/${topic}/${level}` : `/lectures/${topic}/${level}`;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        Router.push(linkTarget);
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


    const refreshedAgo = refreshed ? formatDistance(
        new Date(refreshed),
        new Date(),
        { addSuffix: true }
    ) : 'never';


    return (
        <div className={style.overviewBox} style={{backgroundColor: color}}>
            { hasLecture
              && <div className={style.materialButtonContainer}>
                  <Link href={`/lectures/${topic}/${level}`} title="Material" onMouseEnter={handleMaterialHover}>
                      <img
                          src="/images/240px-Deus_Books.png"
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
                title={`${progress}/3, \nlast refreshed: ${refreshedAgo}`}
            >
                <img src={image}/>
                {<Progress value={progress} size="small" total={3} autoSuccess />}
                <div className={style.boxTitle}>
                    <Link href={linkTarget}>{title} {level}{subtitle && <><br/>{subtitle}</> }</Link>
                </div>
            </div>
        </div>
    );
};

export default Box;

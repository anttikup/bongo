import Image from './Image';

import style from '../styles/StatusCardLayout.module.css';

type StatusProps = {
    image: string;
    children: React.ReactNode;
};


const StatusCardLayout = ({ image, children }: StatusProps) => {

    return (
        <div className={style.statusCardLayout}>
            <Image name={image} />
            <p className={style.statusText}>
                {children}
            </p>
        </div>
    );
};

export default StatusCardLayout;

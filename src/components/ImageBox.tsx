import style from '../styles/ImageBox.module.css';

type Props = {
    src: string;
    onClick?: () => void;
};

const ImageBox = ({ src, onClick }: Props) => {
    return (
        <div className={style.box} onClick={onClick}>
            <img src={src}/>
        </div>
    );
};

export default ImageBox;

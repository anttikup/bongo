import style from '../styles/Tabbable.module.css';

type Event = React.MouseEvent<HTMLAnchorElement, MouseEvent> | React.KeyboardEvent<HTMLAnchorElement>;

type Props = {
    onActivate?: (event: Event) => void;
    children: React.ReactNode;
    className: string;
    activatingKeys: string[];
    [x:string]: unknown;
};

const Tabbable = (props: Props) => {
    const clicked = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        if ( props.onActivate ) {
            props.onActivate(event);
        }
    };

    const keyPressed = (event: React.KeyboardEvent<HTMLAnchorElement>) => {
        if ( props.activatingKeys.includes(event.key) ) {
            event.preventDefault();
            event.stopPropagation();
            if ( props.onActivate ) {
                props.onActivate(event);
            }
        }
    };

    const filteredProps = {
        ...props,
    };
    delete filteredProps.activatingKeys;
    delete filteredProps.onActivate;
    delete filteredProps.children;

    return (
        <a onClick={clicked} onKeyPress={keyPressed} href="" {...filteredProps }  className={`${props.className} ${style.tabbable}`}>
            {props.children}
        </a>
    );
};

export default Tabbable;

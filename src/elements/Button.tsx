import React from "react";

type ButtonProps = {
    id?: string
    onClick: (() => void),
    className?: string,
    scale?: string,
    icon?: React.JSX.Element,
    iconRight?: React.JSX.Element,
    children?: any,
    style?: object
}

function Button(props: Readonly<ButtonProps>) {
    return (
        <button id={props.id} style={props.style} onClick={props.onClick} className={`btn akkurat ${props.className ?? ''}${props.scale ?? ''}`}>
            {props.icon ? (<span className="icon">{props.icon}</span>) : null}
            {props.children ? (<span>{props.children}</span>) : null}
            {props.iconRight ? (<span className="icon">{props.iconRight}</span>) : null}
        </button>
    );
}

export default Button;
import React from "react";

type ButtonProps = {
    className: string,
    icon?: React.JSX.Element,
    onClick: (() => void),
    children?: any,
    style?: object
}

function Button(props: ButtonProps) {

    return (
        <button style={props.style} onClick={props.onClick} className={`btn ${props.className}`}>
            {props.icon ? (<>
                <span className="icon">{props.icon}</span>
                <span>{props.children}</span>
            </>) : <span>{props.children}</span>}

        </button>
    );
}

export default Button;
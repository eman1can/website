import React from "react";

type ButtonProps = {
    className?: string,
    icon?: React.JSX.Element,
    iconRight?: React.JSX.Element,
    onClick: (() => void),
    children?: any,
    style?: object
}

function Button(props: ButtonProps) {

    return (
        <button style={props.style} onClick={props.onClick} className={`btn ${props.className}`}>
            <>
                {props.icon ? (<span className="icon">{props.icon}</span>) : null}
                <span>{props.children}</span>
                {props.iconRight ? (<span className="icon">{props.iconRight}</span>) : null}
            </>

        </button>
    );
}

export default Button;
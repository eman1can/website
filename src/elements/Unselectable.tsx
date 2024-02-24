import React from "react";

type UnselectableProps = {
    className?: string
    style?: object
    children?: any
}

function Unselectable(props: Readonly<UnselectableProps>) {
    return (
        <button
            className={props.className}
            tabIndex={-1}
            style={{
                height: "100%",
                whiteSpace: "normal",
                cursor: "default",
                border: 'none',
                background: 'transparent',
                ...props.style
            }}
        >
            {props.children}
        </button>
    );
}

export default Unselectable;
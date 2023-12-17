import React from "react";
import {Button} from "antd";

type UnselectableProps = {
    style?: object,
    children?: any
}

function Unselectable(props: UnselectableProps) {
    return (
        <Button
            type="link"
            tabIndex={-1}
            style={{
                height: "100%",
                whiteSpace: "normal",
                cursor: "default",
                ...props.style
            }}
        >
            {props.children}
        </Button>
    );
}

export default Unselectable;
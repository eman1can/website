import { ArrowRightOutlined } from "@ant-design/icons";
import Button from "./Button";
import React from "react";

type RightArrowButtonProps = {
    visible: boolean
    onClick: () => void
    label: string
}

const RightArrowButton = (props: Readonly<RightArrowButtonProps>) => {
    return (<Button
        className="btn-solid"
        style={{
            opacity: props.visible ? 1 : 0,
            pointerEvents: props.visible ? 'auto' : 'none',
            width: '175px'
        }}
        onClick={props.onClick}
        iconRight={<ArrowRightOutlined/>}
    >
        {props.label}
    </Button>);
}

export default RightArrowButton;
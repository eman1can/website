import React from "react";
import Button from "../elements/Button";

type DynamicButtonProps = {
    mobile: boolean,
    showIcon?: boolean,
    icon: React.JSX.Element,
    label: string,
    onClick: (() => void);
}

function DynamicButton(props: DynamicButtonProps) {
    if (!props.mobile && props.showIcon) {
        return (<Button
            className="icon-btn btn-on-stars"
            onClick={props.onClick}
            icon={props.icon}
        />);
    }

    return (<Button
        className="btn-on-stars"
        onClick={props.onClick}
        icon={props.icon}
    >
        {props.label}
    </Button>);
}

export default DynamicButton;

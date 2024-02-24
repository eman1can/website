import React from "react";
import Button from "../elements/Button";

type DynamicButtonProps = {
    id?: string
    mobile: boolean,
    showIcon?: boolean,
    icon: React.JSX.Element,
    label: string,
    onClick: (() => void);
}

function DynamicButton(props: DynamicButtonProps) {
    if (!props.mobile && props.showIcon) {
        return (<Button
            className="btn-solid"
            onClick={props.onClick}
            icon={props.icon}
        />);
    }

    return (<Button
        id={props.id}
        className="btn-solid btn-label"
        onClick={props.onClick}
        icon={props.icon}
        style={{flexGrow: 1, width: '222px'}}
    >
        {props.label}
    </Button>);
}

export default DynamicButton;

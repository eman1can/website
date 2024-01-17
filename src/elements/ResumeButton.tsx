import Button from "./Button";
import React from "react";

type ResumeButtonProps = {
    visible: boolean
    onClick: () => void
}

const ResumeButton = (props: ResumeButtonProps) => {
    if (!props.visible)
        return null;
    return <Button
        className="btn-solid"
        style={{
            width: '175px',
            marginRight: '20px'
        }}
        onClick={props.onClick}
    >
        <span>Resume Game</span>
    </Button>
}

export default ResumeButton;
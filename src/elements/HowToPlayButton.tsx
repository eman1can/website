import React from "react";
import DynamicButton from "./DynamicButton";
import { InfoCircleFilled } from "@ant-design/icons";

type HowToPlayButtonProps = {
    mobile: boolean
    onClick: () => void
    showIcon?: boolean
}

const HowToPlayButton = (props: Readonly<HowToPlayButtonProps>): React.JSX.Element => {
    return <DynamicButton
        mobile={props.mobile}
        showIcon={props.showIcon}
        icon={<InfoCircleFilled/>}
        label="How To Play"
        onClick={props.onClick}
    />;
}

export default HowToPlayButton;
import DynamicButton from "./DynamicButton";
import { SettingFilled } from "@ant-design/icons";
import React from "react";

type OptionsButtonProps = {
    mobile: boolean
    showIcon?: boolean
    onClick: () => void
}

const OptionsButton = (props: Readonly<OptionsButtonProps>) => {
    return <DynamicButton
        mobile={props.mobile}
        showIcon={props.showIcon}
        icon={<SettingFilled/>}
        label="Options"
        onClick={props.onClick}
    />;
}

export default OptionsButton;
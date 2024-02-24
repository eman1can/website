import DynamicButton from "./DynamicButton";
import { CaretDownFilled } from "@ant-design/icons";
import React from "react";

type LanguageButtonProps = {
    mobile: boolean
    showIcon?: boolean
    onClick: () => void
    current: string
}

const LanguageButton = (props: Readonly<LanguageButtonProps>) => {
    return <DynamicButton
        id="language-button"
        mobile={props.mobile}
        showIcon={props.showIcon}
        icon={<CaretDownFilled/>}
        onClick={props.onClick}
        label={props.current}
    />;
}

export default LanguageButton;
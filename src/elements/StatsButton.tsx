import DynamicButton from "./DynamicButton";
import { BarChartOutlined } from "@ant-design/icons";
import React from "react";

type StatsButtonProps = {
    mobile: boolean
    showIcon?: boolean
    onClick: () => void
}

const StatsButton = (props: Readonly<StatsButtonProps>) => {
    return <DynamicButton
        mobile={props.mobile}
        showIcon={props.showIcon}
        icon={<BarChartOutlined/>}
        label="Stats"
        onClick={props.onClick}
    />;
}

export default StatsButton;
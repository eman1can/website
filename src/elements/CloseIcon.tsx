import { find } from "../utils";

type CloseIconProps = {
    variant?: "light" | "dark";
}

const CloseIcon = ({variant}: CloseIconProps) => {
    return <img alt="Close" src={find('assets/cts/icon', variant === "dark" ? 'close_black.svg' : 'close.svg')}/>;
}

export default CloseIcon;
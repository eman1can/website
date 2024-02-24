import { find } from "../utils";

type CloseIconProps = {
    variant?: "light" | "dark";
}

const CloseIcon = ({variant}: CloseIconProps) => {
    return <img alt="Close" style={{width: '100%', height: '100%'}} src={find('assets/cts/icon', variant === "dark" ? 'close_black.svg' : 'close.svg')}/>;
}

export default CloseIcon;
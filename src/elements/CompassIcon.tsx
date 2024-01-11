import find from "../utils";

type CompassIconProps = {
    variant?: "light" | "dark";
}

const CompassIcon = ({variant}: CompassIconProps) => {
    return <img alt="Compass" src={find('assets/cts/icon', variant === "dark" ? 'compass_black.svg' : 'compass.svg')}/>;
}

export default CompassIcon;
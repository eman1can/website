import {useEffect, useState} from "react";

export function useMobile() {
    const [width, setWidth] = useState(window.innerWidth);
    const [mobile, setMobile] = useState(width <= 1100);

    const handleWindowResize = () => {
        setWidth(window.innerWidth);
        setMobile(width <= 1100);
    };

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return function cleanup() {
            window.removeEventListener("resize", handleWindowResize);
        };
    });

    return mobile;
}
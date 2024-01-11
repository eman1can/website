import {useEffect, useState} from "react";

export function useMobile() {
    const [width, setWidth] = useState(window.innerWidth);
    const [mobile, setMobile] = useState(width <= 768);

    const handleWindowResize = () => {
        setWidth(window.innerWidth);
        setMobile(width <= 768);
        console.log('[Event] Resize', window.innerWidth, window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return function cleanup() {
            window.removeEventListener("resize", handleWindowResize);
        };
    });

    return mobile;
}
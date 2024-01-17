import {useEffect, useState} from "react";

export function useScale() {
    const [scale, setScale] = useState<string>('lg');

    const calculateScale = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const mobile = width <= 768 || height <= 768;
        let size = 'lg';
        if (width < 500)
            size = 'sm'
        else if (width <= 768)
            size = 'md'
        console.log('[Event] Resize', width, height);
        setScale(`${mobile ? 'mobile ' : ''}${size}`)
    };

    useEffect(() => {
        calculateScale();
        window.addEventListener("resize", calculateScale);
        return function cleanup() {
            window.removeEventListener("resize", calculateScale);
        };
    });

    return scale;
}
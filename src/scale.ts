import {useEffect, useState} from "react";

export function useScale() {
    const [scale, setScale] = useState<string>('lg');

    const calculateScale = () => {
        setTimeout(() => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const mobile = width <= 768 || height <= 768;
            const oblong = width < height;

            let size = 'lg';
            if (width < 500)
                size = 'sm'
            else if (width <= 768)
                size = 'md'
            console.log('[Event] Resize', width, height);

            setScale(`${mobile ? 'mobile ' : ''}${oblong ? 'oblong ' : ''}${size}`)
        }, 250);
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
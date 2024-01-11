import Navbar from "../elements/Navbar";
import LParticles from "../elements/Particles";
import find from "../utils";
import Home from "../cts/Home";
import {useEffect, useState} from "react";

const ConnectTheStars = () => {
    const [height, setHeight] = useState<number>(window.innerHeight - 75);
    const handleResize = () => setHeight(window.visualViewport ? window.visualViewport.height - 75 : 0);
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return function cleanup() {
            window.removeEventListener("resize", handleResize);
        };
    });
    return (
        <div className="body">
            <LParticles config={find('styles', 'connect-the-stars.json')}/>
            <Navbar/>
            <div style={{position: 'absolute', top: '75px', width: '100%', height: height}}>
                <Home/>
            </div>
        </div>
    );
}

export default ConnectTheStars;
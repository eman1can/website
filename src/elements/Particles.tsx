import {useCallback} from "react";

import Particles from "react-particles";
import type {Container, Engine} from "tsparticles-engine";
import {loadSlim} from "tsparticles-slim";


const LParticles = (props: {config: string}) => {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        await console.log('Particles Loaded');
    }, []);

    return (
        <Particles id="tsparticles" url={props.config} init={particlesInit} loaded={particlesLoaded}/>
    );
}

export default LParticles;
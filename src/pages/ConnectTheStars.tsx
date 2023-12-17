import Navbar from "../elements/Navbar";
import LParticles from "../elements/Particles";
import find from "../utils";
import Home from "../cts/Home";

const ConnectTheStars = () => {
    return (
        <div className="body">
            <LParticles config={find('styles', 'connect-the-stars.json')}/>
            <Navbar/>
            <div style={{height: '55px'}}/>
            <Home/>
        </div>
    );
}

export default ConnectTheStars;
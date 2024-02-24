import React from "react";

import { find } from "../../utils";

const HowToPlayModal = () => {
    return (<>
        <div className="modal-title playfair">How to Play</div>

        <div style={{flexGrow: 1}}/>

        <img style={{height: 30}} alt="Goal" src={find('assets/cts/icon', 'how-to-1.svg')} />
        <div className="modal-heading akkurat">- {} -</div>
        <div className="modal-body akkurat">Figure out how two movie stars are connected through their films.</div>

        <div style={{flexGrow: 1}}/>

        <img style={{height: 30}} alt="Goal" src={find('assets/cts/icon', 'how-to-2.svg')} />
        <div className="modal-heading akkurat">- Expand your board -</div>
        <div className="modal-body akkurat">Build new connections by typing the names of movies & stars connected to the ones already in your board.</div>

        <div style={{flexGrow: 1}}/>

        <img style={{height: 30}} alt="Goal" src={find('assets/cts/icon', 'how-to-3.svg')} />
        <div className="modal-heading akkurat">- Connect the Stars -</div>
        <div className="modal-body akkurat">Challenge yourself to find the shortest path!</div>

        <div style={{flexGrow: 1}}/>
    </>);
}

export default HowToPlayModal;

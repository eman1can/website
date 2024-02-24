import React from "react";
import { find } from "../utils";
import Unselectable from "../elements/Unselectable";

function GuideText() {
    return (<div className='guide-text'>
        <Unselectable>
            <div className='board-hint'>
                <img className="board-hint-icon" src={find('assets/cts/icon', 'click.svg')} alt="Click" />
                <p className="board-hint-text">
                    Click a Star/Film for more info
                </p>
            </div>
            <div className="board-hint">
                <img className="board-hint-icon" src={find('assets/cts/icon', 'drag.svg')} alt=" Drag" />
                <p className="board-hint-text">
                    Drag the board or a star/film around
                </p>
            </div>
            <div className="board-hint">
                <img className="board-hint-icon" src={find('assets/cts/icon', 'zoom.svg')} alt="Zoom" />
                <p className="board-hint-text">Zoom in/out of the board</p>
            </div>
        </Unselectable>
    </div>);
}

export default GuideText;

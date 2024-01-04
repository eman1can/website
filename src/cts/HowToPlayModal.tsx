import React from "react";
import {Modal} from "antd";

import ModalRow from "./ModalRow";
import find from "../utils";
import CloseIcon from "../elements/CloseIcon";

type HowToPlayModalProps = {
    visible: boolean,
    onCancel: (() => void),
}

function HowToPlayModal(props: HowToPlayModalProps) {
    return (
        <Modal
            closeIcon={<CloseIcon/>}
            open={props.visible}
            onCancel={props.onCancel}
            footer={null}
            centered
            width={500}
        >
            <ModalRow title="How to Play" />
            <ModalRow
                prefix={<img style={{height: 30}} alt="Goal" src={find('assets/cts', 'how-to-1.svg')} />}
                heading="- The Goal -"
                body="Figure out how two movie stars are connected through their films."
            />
            <ModalRow
                prefix={<img style={{height: 24}} alt="Goal" src={find('assets/cts', 'how-to-2.svg')} />}
                heading="- Expand your board -"
                body="Build new connections by typing the names of movies & stars connected to the ones already in your board."
            />
            <ModalRow
                prefix={<img style={{height: 27}} alt="Goal" src={find('assets/cts', 'how-to-2.svg')} />}
                heading="- Connect the Stars -"
                body="Challenge yourself to find the shortest path!"
            />
        </Modal>
    );
}

export default HowToPlayModal;

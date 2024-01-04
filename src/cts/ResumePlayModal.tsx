import React from "react";
import {Modal} from "antd";

import ModalRow from "./ModalRow";
import find from "../utils";
import CloseIcon from "../elements/CloseIcon";

type ResumePlayData = {
    mode: string,

}

type ResumePlayModalProps = {
    data: ResumePlayData
    visible: boolean,
    onCancel: (() => void),
    onSuccess: (() => void)
}

function ResumePlayModal(props: ResumePlayModalProps) {
    return (
        <Modal
            closeIcon={<CloseIcon/>}
            open={props.visible}
            onCancel={props.onCancel}
            onOk={props.onSuccess}
            footer={null}
            centered
            width={500}
        >
            <ModalRow title="Found Game in Progress" />
            <ModalRow
                heading="- Mode -"
                body={props.data.mode}
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

export default ResumePlayModal;

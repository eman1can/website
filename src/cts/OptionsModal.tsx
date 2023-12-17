import React from "react";
import {Row, Col} from "antd";
import {Switch, Modal} from "antd";
import ModalRow from "./ModalRow";
import find from "../utils";

type OptionsRowProps = {
    style?: object,
    optionText: string,
    useOption: boolean,
    setUseOption: ((value: boolean) => void),
    disabled?: boolean
}

function OptionsRow(props: OptionsRowProps) {
    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{textAlign: "start", justifySelf: 'flex-start', flexGrow: 1}}>
                <span className="message">{props.optionText}</span>
            </div>
            <div style={{justifySelf: 'flex-end'}}>
                <Switch
                    checked={props.useOption}
                    onChange={checked => props.setUseOption(checked)}
                    disabled={props.disabled}
                />
            </div>
        </div>
    );
}

type OptionsModalProps = {
    onCancel: (() => void),
    visible: boolean,
    options: {
        useStandard: boolean,
        useExpanded: boolean,
        useBollywood: boolean,
        useBlockbuster: boolean,
        blockMovieSeries: boolean,
        setUseStandard: ((value: boolean) => void),
        setUseExpanded: ((value: boolean) => void),
        setUseBollywood: ((value: boolean) => void),
        setUseBlockbuster: ((value: boolean) => void),
        setBlockMovieSeries: ((value: boolean) => void),
    }
}

function OptionsModal(props: OptionsModalProps) {
    const options = props.options;
    const numSelected = [
        options.useStandard,
        options.useExpanded,
        options.useBollywood,
        options.useBlockbuster
    ].filter(x => x).length;
    return (
        <Modal
            closeIcon={<img alt="Close" src={find('assets/cts', 'close.svg')} />}
            open={props.visible}
            onCancel={props.onCancel}
            footer={null}
            centered
            width={550}
        >
            <ModalRow title="Options" />
            <Col style={{padding: "16px 60px 32px"}}>
                <OptionsRow
                    optionText="Cannot use films from a series"
                    useOption={options.blockMovieSeries}
                    setUseOption={options.setBlockMovieSeries}
                />
                <div style={{marginBottom: 24}} />
                <p className="modal-subtitle">- Choose For Me -</p>
                <OptionsRow
                    optionText="Use default actors"
                    useOption={options.useStandard}
                    setUseOption={options.setUseStandard}
                    disabled={options.useStandard && numSelected === 1}
                />
                <OptionsRow
                    style={{marginTop: 8}}
                    optionText="Use expanded actors"
                    useOption={options.useExpanded}
                    setUseOption={options.setUseExpanded}
                    disabled={options.useExpanded && numSelected === 1}
                />
                <OptionsRow
                    style={{marginTop: 8}}
                    optionText="Use Bollywood actors"
                    useOption={options.useBollywood}
                    setUseOption={options.setUseBollywood}
                    disabled={options.useBollywood && numSelected === 1}
                />
                <OptionsRow
                    style={{marginTop: 8}}
                    optionText="Use pre-blockbuster era actors"
                    useOption={options.useBlockbuster}
                    setUseOption={options.setUseBlockbuster}
                    disabled={options.useBlockbuster && numSelected === 1}
                />
            </Col>
        </Modal>
    );
}

export default OptionsModal;

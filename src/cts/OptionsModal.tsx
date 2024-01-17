import React from "react";
import {Row, Col} from "antd";
import {Switch, Modal} from "antd";
import ModalRow from "./ModalRow";
import { find } from "../utils";
import CloseIcon from "../elements/CloseIcon";

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
    options: {loc: string, title: string, state: boolean, disabled?: boolean, toggle: ((newValue: boolean) => void)}[]
}

function OptionsModal({visible, options, onCancel}: OptionsModalProps) {
    const sections = ['Gameplay', 'Choose For Me']
    return (
        <Modal
            closeIcon={<CloseIcon/>}
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            width={550}
        >
            <ModalRow title="Options" />
            <Col style={{padding: "16px 60px 32px", marginBottom: '-24px'}}>
                {sections.map(s => {
                    return (<div key={s} style={{marginBottom: 24}}>
                        <p className="modal-subtitle">- {s} -</p>
                        {options.filter(v => v.loc === s)
                            .map(v => {
                                return <OptionsRow
                                    key={v.title}
                                    optionText={v.title}
                                    useOption={v.state}
                                    setUseOption={v.toggle}
                                    disabled={v.disabled}
                                />;
                            })}
                    </div>);
                })}
            </Col>
        </Modal>
    );
}

export default OptionsModal;

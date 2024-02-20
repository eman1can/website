import React from "react";
import {Col} from "antd";
import {Switch, Modal} from "antd";
import ModalRow from "./ModalRow";

type OptionsRowProps = {
    style?: object,
    optionText: string,
    useOption: boolean,
    setUseOption: ((value: boolean) => void),
    disabled?: boolean
}

function OptionsRow(props: OptionsRowProps) {
    return (
        <div style={{display: 'flex', flexDirection: 'row', gap: '12px'}}>
            <div style={{textAlign: "start", justifySelf: 'flex-start', flexGrow: 1}}>
                <span className="modal-body akkurat">{props.optionText}</span>
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

type Option = {
    loc: string,
    title: string,
    state: boolean,
    disabled?: boolean,
    toggle: (newValue: boolean) => void
}

function getOptionsModal(options: Array<Option>) {
    const sections = ['Gameplay', 'Choose For Me']
    return (
        <>
            <div className="modal-title playfair">Options</div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                padding: "16px 60px 32px",
                marginBottom: '-24px'
            }}>
                {sections.map(s => {
                    return (<div key={s} style={{marginBottom: 24}}>
                        <p className="modal-heading akkurat">- {s} -</p>
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
            </div>
        </>
    );
}

export default getOptionsModal;

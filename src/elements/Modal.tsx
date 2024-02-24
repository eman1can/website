import React, { useState } from "react";
import CloseIcon from "./CloseIcon";
import Button from "./Button";
import RightArrowButton from "./RightArrowButton";
import OptionsModal from "../cts/modals/OptionsModal";
import { Dict } from "../cts/types";
import StatisticModal from "../cts/modals/StatisticsModal";
import ResumeModal from "../cts/modals/ResumePlayModal";
import HowToPlayModal from "../cts/modals/HowToPlayModal";
import SuccessModal from "../cts/modals/SuccessModal";

type CloseButtonProps = {
    scale: string
    setVisible: (newVisible: boolean) => void
    onCancel: () => void
    onClose?: () => void
}

const CloseButton = (props: CloseButtonProps) => (
    <div style={{position: 'relative', top: 0, right: 0}}>
        <div style={{position: 'absolute', top: 0, right: -25}}>
            <Button scale={props.scale} style={{padding: '10px', margin: '8px'}} onClick={() => {
                props.setVisible(false);
                if (props.onClose)
                    props.onClose();
                else
                    props.onCancel();
            }}>
                <CloseIcon/>
            </Button>
        </div>
    </div>
)

type NextButtonProps = {
    scale: string
    success?: string
    onSuccess: () => void
}

const NextButton = (props: NextButtonProps) => {
    return (
        <RightArrowButton visible={true} onClick={props.onSuccess} label={props.success ?? ''} scale={props.scale} style={{maxWidth: '222px', flexGrow: 1}}/>
    );
}

type CancelButtonProps = {
    scale: string
    cancel?: string
    onCancel: () => void
}

const CancelButton = (props: CancelButtonProps) => {
    return (
        <Button
            className={`btn-solid ${props.scale}`}
            style={{maxWidth: '222px', flexGrow: 1}}
            onClick={props.onCancel}
        >
            {props.cancel}
        </Button>
    );
}

export type ModalProps = {
    scale: string
    modalName: string
    getString: (key: string) => string
    onCancel: () => void
    onSuccess: () => void
    onClose?: () => void
    cancel?: string
    success?: string
    showClose?: boolean
}

type ModalDefProps = {
    getString: (key: string) => string
}

const Modal = (props: Readonly<ModalProps>) => {
    const [visible, setVisible] = useState(true);

    const modalDefinitions: Dict<(props: Readonly<ModalDefProps>) => React.JSX.Element> = {
        'cts_Options': OptionsModal,
        'cts_Statistic': StatisticModal,
        'cts_Resume': ResumeModal,
        'cts_HowToPlay': HowToPlayModal,
        'cts_Success': SuccessModal
    }

    if (!props.modalName)
        return null;

    if (!visible)
        return null;

    return (
        <div className={`modal-container ${props.scale}`}>
            <div className={`modal ${props.scale}`}>
                {props.showClose ? React.createElement(CloseButton, {...props, setVisible: setVisible}) : null}
                {React.createElement(modalDefinitions[props.modalName], {getString: props.getString})}
                {props.cancel || props.success ? (
                    <div className="row center" style={{
                        margin: '15px',
                        gap: '15px',
                        justifySelf: 'flex-end'
                    }}>
                        {props.cancel ? React.createElement(CancelButton, props) : null}
                        {props.success ? React.createElement(NextButton, props) : null}
                    </div>
                ) : null}
            </div>
        </div>
    )
        ;
}

export default Modal;
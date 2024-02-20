import React, {useState} from "react";
import CloseIcon from "./CloseIcon";
import Button from "./Button";
import RightArrowButton from "./RightArrowButton";

type CloseButtonProps = {
    scale: string
    setVisible: (newVisible: boolean) => void
    onCancel: () => void
}

const CloseButton = (props: CloseButtonProps) => (
    <div style={{position: 'relative', top: 0, right: 0}}>
        <div style={{position: 'absolute', top: 0, right: 0}}>
            <Button scale={props.scale} onClick={() => {
                props.setVisible(false);
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
        <RightArrowButton visible={true} onClick={props.onSuccess} label={props.success ?? ''} scale={props.scale}/>
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
            style={{ width: '175px' }}
            onClick={props.onCancel}
        >
            {props.cancel}
        </Button>
    );
}

export type ModalProps = {
    scale: string
    onCancel: () => void
    onSuccess: () => void
    cancel?: string
    success?: string
    children?: React.JSX.Element | string | null
    showClose?: boolean
}


const Modal = (props: Readonly<ModalProps>) => {
    const [visible, setVisible] = useState(true);

    if (!props.children)
        return null;

    if (!visible)
        return null;

    return (
        <div className={`modal-container ${props.scale}`}>
            <div className={`modal ${props.scale}`}>
                {props.showClose ? React.createElement(CloseButton, {...props, setVisible: setVisible}) : null}
                {props.children}
                <div className="row center" style={{
                    margin: '15px',
                    gap: '15px'
                }}>
                    {props.cancel ? React.createElement(CancelButton, props) : null}
                    {props.success ? React.createElement(NextButton, props) : null}
                </div>
            </div>
        </div>
    );
}

export default Modal;
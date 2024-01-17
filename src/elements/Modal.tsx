import React, { useState } from "react";
import CloseIcon from "./CloseIcon";
import Button from "./Button";

type ModalProps = {
    scale: string
    visible: boolean
    onCancel?: () => void,
    children?: React.JSX.Element | string | null
}
const Modal = (props: Readonly<ModalProps>) => {
    const [visible, setVisible] = useState(props.visible);
    if (!visible)
        return null;
    const close = (<div style={{position: 'relative', top: 0, right: 0}}>
        <div style={{position: 'absolute', top: 0, right: 0}}>
            <Button scale={props.scale} onClick={() => {
                setVisible(false);
                if (props.onCancel)
                    props.onCancel();
            }}><CloseIcon/></Button>
        </div>
    </div>)

    return <div className={`modal-container ${props.scale}`}>
        <div className={`modal ${props.scale}`}>
            {close}
            {props.children}
        </div>
    </div>


    // if (props.mobile)
    //     return (<div className="full">
    //
    //     </div>);
    // return <div className="sheet full">
    //     <div className="modal part">
    //         {close}
    //         {props.children}
    //     </div>
    // </div>;
}

export default Modal;
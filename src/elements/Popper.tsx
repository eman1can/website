import React from "react";

type PopperProps = {
    content: React.JSX.Element
    visible: boolean
    anchor: string
}
const Popper = (props: Readonly<PopperProps>) => {
    return (<div style={{
        position: 'fixed',
        width: document.getElementById(props.anchor)?.getBoundingClientRect().width,
        left: document.getElementById(props.anchor)?.getBoundingClientRect().left,
        top: document.getElementById(props.anchor)?.getBoundingClientRect().bottom,
        zIndex: 2
    }}>
        <div className={`popper ${props.visible && 'visible'}`} style={{
            flex: '1 0 0',
            width: '100%',
            backdropFilter: 'blur(30px)'
        }}>
            {props.content}
        </div>
    </div>);
}

export default Popper;
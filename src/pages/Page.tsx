import { find } from "../utils";
import React, {useState} from "react";
import { useScale } from "../scale";
import Navbar from "../elements/Navbar";
import Modal, {ModalProps} from "../elements/Modal";

export type PageContentProps = {
    scale: string
    mobile: boolean
    oblong: boolean
    setModalContent: (newContent: ModalProps | null) => void
}

type PageProps = {
    name: string
    nav?: boolean
    root: (props: PageContentProps) => React.JSX.Element
}

function Page({name, root, nav = false}: Readonly<PageProps>) {
    const scale = useScale();
    const props = {scale: scale, mobile: scale.includes('mobile'), oblong: scale.includes('oblong')};

    const [modalContent, setModalContent] = useState<ModalProps | null>(null);

    return <>
        <link href={find('styles', `${name}.css`)} rel="stylesheet"/>
        {/*<div style={{*/}
        {/*    position: 'absolute',*/}
        {/*    backgroundColor: 'red',*/}
        {/*    width: '100%',*/}
        {/*    top: '0px',*/}
        {/*    fontSize: '20pt',*/}
        {/*    textAlign: 'center',*/}
        {/*    zIndex: '20'*/}
        {/*}}>{`${props.scale} ${name}`}</div>*/}
        {nav ? <>
            {React.createElement(Navbar, props)}
            <div className={`body ${props.scale}`}>
                {modalContent ? React.createElement(Modal, {...modalContent, scale: props.scale}) : null}
                {React.createElement(root, {...props, setModalContent: setModalContent})}
            </div>
        </> : <>
            {modalContent ? React.createElement(Modal, {...modalContent, scale: props.scale}) : null}
            {React.createElement(root, {...props, setModalContent: setModalContent})}
        </>}
    </>;
}

export default Page;
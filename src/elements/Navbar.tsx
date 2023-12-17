import {Button, Col, Row} from "antd";
import React, {useEffect, useState} from "react";
import {MenuOutlined} from "@ant-design/icons";
import {useMobile} from "../mobile";
import {useLocation} from "react-router-dom";
import find from "../utils";

const pages: [string, string, string][] = [
    ['Resume', 'resume', '/resume'],
    ['Blog', 'blog', '/blog'],
    ['Library', 'library', '/library'],
    ['Projects', 'projects', '/projects'],
    ['Connect The Stars', 'connect-the-stars', '/connect-the-stars'],
];

const Navbar = () => {
    const [modal, setModal] = useState(false);
    const onModal = () => setModal(!modal);

    const mobile = useMobile();

    const {pathname, search} = useLocation();

    return mobile ? (
        <div className="navbar mobile">
            <div className="black">
                <a href="/">Home</a>
                <div style={{flexGrow: '1'}}/>
                <Button onClick={onModal} style={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    justifySelf: 'flex-end',
                    padding: '15px 20px',
                }}>
                    <MenuOutlined style={{color: 'white', fontSize: '1.5em'}}/>
                </Button>
            </div>
            {mobile && modal && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyItems: 'flex-start',
                    alignItems: 'flex-end',
                    backgroundColor: 'black',
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    height: '100vh',
                    width: '300px',
                }}>
                    <button onClick={() => setModal(false)} className="modal-close">
                        <MenuOutlined style={{color: 'white', fontSize: '1.5em'}}/>
                    </button>
                    {pages.map(p => {return pathname.endsWith(p[1]) ? null : (
                        <a key={p[1]} href={p[2]}>{p[0]}</a>
                    )})}
                </div>
            )}
        </div>
    ) : (
        <div className="navbar black">
            <a href="/">Home</a>
            <div style={{flexGrow: 1}}/>
            {pages.map(p => {return pathname.endsWith(p[1]) ? null : (
                <a key={p[1]} href={p[2]} style={{justifySelf: 'flex-end'}}>{p[0]}</a>
            )})}
        </div>
    );
}

export default Navbar;
import React, {useState} from "react";
import {MenuOutlined} from "@ant-design/icons";
import {useLocation} from "react-router-dom";


const pages: [string, string, string][] = [
    ['Resume', 'resume', '/resume'],
    ['Blog', 'blog', '/blog'],
    ['Library', 'library', '/library'],
    ['Projects', 'projects', '/projects'],
    ['Connect The Stars', 'connect-the-stars', '/connect-the-stars'],
];

type NavbarProps = {
    scale: string,
    mobile: boolean
}

const Navbar = (props: Readonly<NavbarProps>) => {
    const [drawer, setDrawer] = useState(false);
    const onDrawer = () => setDrawer(!drawer);
    const {pathname} = useLocation();


    return <div className={`navbar navbar-black ${props.scale}`}>
        <a href="/">Home</a>
        <div style={{flexGrow: 1}}/>
        {props.mobile ? (
            <button onClick={onDrawer} style={{
                backgroundColor: "transparent",
                borderWidth: 0,
                justifySelf: 'flex-end',
            }}>
                <MenuOutlined className={props.scale} style={{color: 'white'}}/>
            </button>
        ) : pages.map(p => {return pathname.endsWith(p[1]) ? null : (
            <a key={p[1]} href={p[2]} style={{justifySelf: 'flex-end'}}>{p[0]}</a>
        )})}
    </div>

        // <div className={`navbar ${props.scale}`}>
        //     <div className="navbar-black">
        //         <a href="/">Home</a>
        //         <div style={{flexGrow: '1'}}/>
        //         <Button onClick={onModal} style={{
        //             backgroundColor: "transparent",
        //             borderWidth: 0,
        //             justifySelf: 'flex-end',
        //         }}>
        //             <MenuOutlined style={{color: 'white', fontSize: '1.5em'}}/>
        //         </Button>
        //     </div>
        //     {mobile && modal && (
        //         <div style={{
        //             display: 'flex',
        //             flexDirection: 'column',
        //             justifyItems: 'flex-start',
        //             alignItems: 'flex-end',
        //             backgroundColor: 'black'
        //         }}>
        //             <button onClick={() => setModal(false)} className="modal-close">
        //                 <MenuOutlined style={{color: 'white', fontSize: '1.5em'}}/>
        //             </button>
        //             {pages.map(p => {return pathname.endsWith(p[1]) ? null : (
        //                 <a key={p[1]} href={p[2]}>{p[0]}</a>
        //             )})}
        //         </div>
        //     )}
        // </div>
}

export default Navbar;
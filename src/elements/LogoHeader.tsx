import Unselectable from "./Unselectable";
import { find } from "../utils";
import React from "react";

const LogoHeader = ({title}: {title: string}) => (<div style={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '15px'
}}>
    <Unselectable style={{padding: 0}}>
        <img
            className="unselectable"
            src={find('assets/cts', 'logo.png')}
            alt="Logo"
            style={{width: 56}}
        />
    </Unselectable>
    <Unselectable style={{padding: 0}}>
        <h1
            className="unselectable playfair"
            style={{
                color: "#fff",
                marginBottom: 0,
                marginLeft: '12px'
            }}
        >
            {title}
        </h1>
    </Unselectable>
</div>);

export default LogoHeader;
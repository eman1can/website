import React from 'react';

import LParticles from "../elements/Particles";
import {find} from "../utils";

import './home.scss';
import {PageContentProps} from "./Page";

function Home(props: Readonly<PageContentProps>) {
    return (<>
        <LParticles config={find('styles', 'home.json')}/>
        <div className="row">
            <div className="button-col">
                <div className="header">
                    <button className={`home-title-btn ${props.scale}`}>Ethan Wolfe</button>
                    <div className={`subtitle ${props.scale}`}>Computer Scientist — Fiction Writer — Completionist</div>
                </div>
                <div className="link-col">
                    <a className={`main-btn ${props.scale}`} href="#/resume">Resume</a>
                    <a className={`main-btn ${props.scale}`} href="#/blog">Blog</a>
                    <a className={`main-btn ${props.scale}`} href="#/library">Library</a>
                    <a className={`main-btn ${props.scale}`} href="#/projects">Projects</a>
                    <a className={`main-btn ${props.scale}`} href="#/connect-the-stars">Connect the Stars</a>
                </div>
            </div>
            {(props.mobile || props.oblong) ? null : (
                <div className="img-row">
                    <div className="ripped"/>
                    <img
                        className="main-img"
                        src={find('assets/home', 'ethan-wolfe.jpg')}
                        alt="Ethan Wolfe Standing against a wall."
                    />
                </div>
            )}
        </div>
    </>);
}

export default Home;
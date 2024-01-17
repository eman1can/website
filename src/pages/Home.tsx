import React from 'react';

import LParticles from "../elements/Particles";
import { find } from "../utils";

import './home.scss';
import { PageContentProps } from "./Page";

function Home(props: Readonly<PageContentProps>) {
    const mobile = props.scale.startsWith('mobile');
    return (
        <div className="body">
            <div className="full">
                <LParticles config={find('styles', 'home.json')}/>
                <div className="row">
                    <div className="button-col">
                        <div className="header">
                            <button className="title-btn">Ethan Wolfe</button>
                            <div className="subtitle">Computer Scientist — Fiction Writer — Completionist</div>
                        </div>
                        <div className="link-col">
                            <a className="main-btn" href="/resume">Resume</a>
                            <a className="main-btn" href="/blog">Blog</a>
                            <a className="main-btn" href="/library">Library</a>
                            <a className="main-btn" href="/projects">Projects</a>
                            <a className="main-btn" href="/connect-the-stars">Connect the Stars</a>
                        </div>
                    </div>
                    {mobile ? null : (
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
            </div>
        </div>
    );
}

export default Home;
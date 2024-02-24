import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/antd.dark.css';

import {
    RouterProvider, createHashRouter
} from "react-router-dom";

import Home from "./pages/Home";
import Blog from "./pages/Blog";
import ConnectTheStars from "./pages/ConnectTheStars";

import './index.css';
import Page from "./pages/Page";
import Library from "./pages/Library";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createHashRouter([
    {path: "", element: <Page name="home" root={Home}/>},
    {path: "/blog", element:<Page nav name="blog" root={Blog}/>},
    {path: "/connect-the-stars", element: <Page name="cts" root={ConnectTheStars}/>},
    {path: "/resume", element: <Page nav name="resume" root={Resume}/>},
    {path: "/library", element: <Page nav name="library" root={Library}/>},
    {path: "/projects", element: <Page nav name="projects" root={Projects}/>},
], {basename: '/'});

root.render(
    <RouterProvider router={router}/>
);

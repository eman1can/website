import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/antd.dark.css';

import {
    RouterProvider, createBrowserRouter
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

const router = createBrowserRouter([
    {path: "", element: <Page name="home"><Home/></Page>},
    {path: "/blog", element: <Page name="blog"><Blog/></Page>},
    {path: "/connect-the-stars", element: <Page name="cts"><ConnectTheStars/></Page>},
    {path: "/resume", element: <Page name="resume"><Resume/></Page>},
    {path: "/library", element: <Page name="library"><Library/></Page>},
    {path: "/projects", element: <Page name="projects"><Projects/></Page>},
], {basename: '/'});

root.render(
    <RouterProvider router={router}/>
);

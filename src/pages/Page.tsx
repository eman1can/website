import { find } from "../utils";
import React from "react";
import { useScale } from "../scale";
import Navbar from "../elements/Navbar";

export type PageContentProps = {
    scale: string,
    mobile: boolean
}

type PageProps = {
    name: string
    nav?: boolean
    root: (props: PageContentProps) => React.JSX.Element
}

function Page({name, root, nav = false}: Readonly<PageProps>) {
    const scale = useScale();
    const props = {scale: scale, mobile: scale.startsWith('mobile')};
    return <>
        <link href={find('styles', `${name}.css`)} rel="stylesheet"/>
        {nav ? <>{Navbar(props)}<div className={`body ${props.scale}`}/></> : null}
        {root(props)}
    </>;
}

export default Page;
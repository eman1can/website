import find from "../utils";

type PageProps = {
    name: string;
    children: any;
}

function Page({name, children}: PageProps) {
    return <>
        <link href={find('styles', `${name}.css`)} rel="stylesheet"/>
        {children}
    </>;
}

export default Page;
import { PageContentProps } from "./Page";

const Library = (props: Readonly<PageContentProps>) => {
    const mobile = props.scale.startsWith('mobile');
    return <div>Empty Page</div>;
}

export default Library;
import { PageContentProps } from "./Page";

const Resume = (props: Readonly<PageContentProps>) => {
    const mobile = props.scale.startsWith('mobile');
    return <div>Empty Page</div>;
}

export default Resume;
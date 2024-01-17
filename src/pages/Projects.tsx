import { PageContentProps } from "./Page";

const Projects = (props: Readonly<PageContentProps>) => {
    const mobile = props.scale.startsWith('mobile');
    return <div>Empty Page</div>;
}

export default Projects;
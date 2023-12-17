function find(p: string, name: string) {
    return `${process.env.PUBLIC_URL}/${p}/${name}`;
}

export default find;
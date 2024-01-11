export function isNormalInteger(s: string): boolean {
    const n = Math.floor(Number(s));
    return n !== Infinity && String(n) === s && n >= 0;
}

export function toTitleCase(s: string): string {
    return s.split(' ').map(p => p[0].toUpperCase() + p.substring(1).toLowerCase()).join(' ');
}

export function getRandomItemFromArray<S>(list: Array<S>): S {
    return list[Math.floor(Math.random() * list.length)];
}
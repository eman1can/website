export function isNormalInteger(s: string) {
    const n = Math.floor(Number(s));
    return n !== Infinity && String(n) === s && n >= 0;
}
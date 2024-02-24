import slugify from "slugify";
import React from "react";
import { message } from "antd";

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

export function toGraphKey(name: string) {
    return slugify(name, {
        replacement: "-",
        remove: /[.,…'?/#!$%^&*;:{}=_`~()]/g,
        lower: true
    })
        .replace(/(^the-)|(^a-)/g, "")
        .replace(/(-the-)/g, "-")
        .replace(/^[a-z]-[a-z]-/g, m => m.replace("-", ""));
}

const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

function numToWordsMillions(num: number): string {
    if (num >= 1000000) {
        return numToWordsMillions(Math.floor(num / 1000000)) + " million " + numToWordsThousands(num % 1000000);
    } else {
        return numToWordsThousands(num);
    }
}

function numToWordsThousands(num: number): string {
    if (num >= 1000) {
        return numToWordsHundreds(Math.floor(num / 1000)) + " thousand " + numToWordsHundreds(num % 1000);
    } else {
        return numToWordsHundreds(num);
    }
}

function numToWordsHundreds(num: number): string {
    if (num > 99) {
        return ones[Math.floor(num / 100)] + " hundred " + numToWordsTens(num % 100);
    } else {
        return numToWordsTens(num);
    }
}

function numToWordsTens(num: number): string {
    if (num < 10) return ones[num];
    else if (num >= 10 && num < 20) return teens[num - 10];
    else {
        return tens[Math.floor(num / 10)] + " " + ones[num % 10];
    }
}

export function numToWords(num: number): string {
    if (num === 0)
        return "zero";
    return numToWordsMillions(num);
}

export function numToWordGuess(guess: string) {
    const parts = guess.split(' ');
    let hasNumber = false;
    parts.forEach((p, ix) => {
        const num = parseInt(p);
        if (Number.isSafeInteger(num)) {
            hasNumber = true;
            parts[ix] = numToWords(num);
        }
    });
    if (hasNumber)
        return parts.join(' ');
    return null;
}

export function ObjectMap(obj: any, fn: (v: any, k: string, ix: number) => any) {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v], ix) => [k, fn(v, k, ix)])
    )
}

export function downloadFile(data: string, filename: string, mimetype: string = 'application/json') {
    const blob = new Blob([JSON.stringify(data)], {type: mimetype});
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
}

export function showAlert(key: string, content: string | React.JSX.Element, icon: React.JSX.Element) {
    message.destroy("copied");
    message.success({
        content: content,
        className: "message game-message",
        icon: icon,
        key: key
    }).then(() => {});
}
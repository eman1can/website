import {useEffect, useState} from "react";
import { Dict } from "./types";

function readLocalStorage<S>(key: string, defaultValue: S): S {
    const local: string | null = localStorage.getItem(key);
    if (!local)
        return defaultValue;
    return JSON.parse(local);
}

function useLocalStorage<S>(key: string, initialState: S): [S, ((newValue: S) => void)] {
    const defaultValue = readLocalStorage<S>(key, initialState);

    const [value, setValue] = useState<S>(defaultValue);

    function dispatch(newValue: S) {
        localStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
    }

    return [value, dispatch];
}

function readManyLocalStorage<S>(keys: Array<string>): Dict<S> {
    const value: Dict<S> = {};

    keys.forEach(k => {
        const local: string | null = localStorage.getItem(k);
        console.log('Read Local Value', k, local);
        if (local)
            value[k] = JSON.parse(local);
    });

    return value;
}

export default useLocalStorage;
export {readLocalStorage, readManyLocalStorage};
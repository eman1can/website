import {useEffect, useState} from "react";

function useLocalStorage<S>(key: string, initialState: S): [S, ((newValue: S) => void)] {
    const [value, setValue] = useState(initialState);

    // Read in the value from local storage
    useEffect(() => {
        const local: string | null = localStorage.getItem(key);
        console.log(`Read ${key} from local storage`, local);
        if (local) {
            switch (typeof initialState) {
                case "string":
                    // @ts-ignore
                    setValue(local);
                    break;
                case "boolean":
                    // @ts-ignore
                    setValue(local === "true" ?? false);
                    break;
                case "number":
                    // @ts-ignore
                    setValue(Number(local));
                    break;
                default:
                    setValue(JSON.parse(local));
            }
        }
    }, [key, setValue, initialState]);

    function dispatch(newValue: S) {
        if (typeof initialState === "object") {
            localStorage.setItem(key, JSON.stringify(newValue));
        } else {
            localStorage.setItem(key, `${newValue}`);
        }
        console.log(`Write ${key} to local storage`, newValue);
        setValue(newValue);
    }

    return [value, dispatch];
}

export default useLocalStorage;
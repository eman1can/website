import {useEffect, useState} from "react";

function useLocalStorage<S>(key: string, initialState: S): [S, ((newValue: S) => void)] {
    const [value, setValue] = useState<S>(initialState);

    function dispatch(newValue: S) {
        localStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
    }

    useEffect(() => {
        const local: string | null = localStorage.getItem(key);
        if (local)
            setValue(JSON.parse(local));
        else
            dispatch(initialState);
    }, [key, setValue, initialState, dispatch]);

    return [value, dispatch];
}

export default useLocalStorage;
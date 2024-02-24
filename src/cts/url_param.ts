import React, {useEffect, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";


type ParamData = {
    mode: string,
    subMode: string,
    [key: string]: string | null
}

function useURLParam(initialState: ParamData): [ParamData, ((k: string, v: string) => void)] {
    const [value, setValue] = useState<ParamData>(initialState);

    const navigate = useNavigate();
    const { pathname, search } = useLocation();
    const params = new URLSearchParams(search);

    useEffect(() => {
        const d = value;

        for (const k in d) {
            // Read the value from the parameter
            const pv = params.get(k);
            if (pv)
                d[k] = pv;

            console.log('Read Param', pv);

            // Set the value of the parameter
            const dv = d[k];
            if (dv)
                params.set(k, dv);

            console.log('Write Param', dv);

            console.log(`Initial ${pathname}?${params.toString()}`);
            navigate(`${pathname}?${params.toString()}`, {replace: true});
        }

        setValue(d);

    }, [setValue, value, pathname, search]);

    // Set values in local storage
    function dispatch(k: string, v: string | null) {
        const d = value;

        if (v) {
            params.set(k, v);
            d[k] = v;
            console.log('Wrote param', k, v);
        } else {
            params.delete(k);
            console.log('Delete Param', k);
        }
        setValue(d);

        console.log(`Update ${pathname}?${params.toString()}`, value);
        navigate(`${pathname}?${params.toString()}`, {replace: true});
    }

    return [value, dispatch];
}

export default useURLParam;
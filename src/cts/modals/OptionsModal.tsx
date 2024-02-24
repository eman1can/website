import React from "react";
import {Switch} from "antd";
import useLocalStorage from "../local_storage";


type Option = {
    title: string
    state: boolean
    disabled?: boolean
    toggle: (newValue: boolean) => void
}

type Section = {
    title: string
    options: Array<Option>
}

const OptionsModal = () => {
    const [useStandard, setUseStandard] = useLocalStorage<boolean>('use_default', true);
    const [useExpanded, setUseExpanded] = useLocalStorage<boolean>('use_expanded', false);
    const [useBollywood, setUseBollywood] = useLocalStorage<boolean>('use_bollywood', false);
    const [useBlockbuster, setUseBlockbuster] = useLocalStorage<boolean>('use_blockbuster', false);
    const [allowMovieSeries, setAllowMovieSeries] = useLocalStorage<boolean>('allow_movie_series', true);
    const [allowTVSeries, setAllowTVSeries] = useLocalStorage<boolean>('allow_tv_series', false);
    const [allowHints, setAllowHints] = useLocalStorage<boolean>('use_hints', false);
    const [disableProfile, setDisableProfile] = useLocalStorage<boolean>('disable_profile', false);

    console.log('Use Standard', useStandard);

    const numSelected = [useStandard, useExpanded, useBollywood, useBlockbuster].filter(v => v).length;

    const sections: Array<Section> = [
        {
            title: 'Gameplay',
            options: [
                {title: 'Allow In-Game Hints', state: allowHints, toggle: setAllowHints},
                {title: 'Allow Movie in a Series', state: allowMovieSeries, toggle: setAllowMovieSeries},
                {title: 'Allow TV Shows', state: allowTVSeries, toggle: setAllowTVSeries},
                {title: 'Disable Profile Pictures', state: disableProfile, toggle: setDisableProfile},
            ]
        },
        {
            title: 'Choose For Me',
            options: [
                {
                    title: 'Use default actors',
                    state: useStandard,
                    toggle: setUseStandard,
                    disabled: useStandard && numSelected === 1
                },
                {
                    title: 'Use expanded actors',
                    state: useExpanded,
                    toggle: setUseExpanded,
                    disabled: useExpanded && numSelected === 1
                },
                {
                    title: 'Use Bollywood actors',
                    state: useBollywood,
                    toggle: setUseBollywood,
                    disabled: useBollywood && numSelected === 1
                },
                {
                    title: 'Use pre-blockbuster actors',
                    state: useBlockbuster,
                    toggle: setUseBlockbuster,
                    disabled: useBlockbuster && numSelected === 1
                }
            ]
        }
    ];

    return (
        <>
            <div className="modal-title playfair">Options</div>
            <div style={{flexGrow: 1}}/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                padding: "16px 60px 32px",
                marginBottom: '-24px'
            }}>
                {sections.map(s => {
                    return (<div key={s.title} style={{marginBottom: 24, flexGrow: 1}}>
                        <p className="modal-heading akkurat">- {s.title} -</p>
                        {s.options.map(v => (
                            <div key={v.title} style={{display: 'flex', flexDirection: 'row', gap: '12px'}}>
                                <div style={{textAlign: "start", justifySelf: 'flex-start', flexGrow: 1}}>
                                    <span className="modal-body akkurat">{v.title}</span>
                                </div>
                                <div style={{justifySelf: 'flex-end'}}>
                                    <Switch
                                        checked={v.state}
                                        onChange={c => v.toggle(c)}
                                        disabled={v.disabled}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>);
                })}
            </div>
            <div style={{flexGrow: 1}}/>
        </>
    );
}

export default OptionsModal;

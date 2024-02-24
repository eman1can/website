import { Dict } from "./cts/types";
import { useState } from "react";
import useLocalStorage from "./cts/local_storage";

export const SUBTITLE_COUNT = 5;

const en: Dict<Dict<string>> = {
    mode: {
        classic: "Classic",
        detour: "Detour",
        rising: "Rising Stardom",
        value: "Threshold",
        person: "Attainment",
        web: "Web of Stars",
        score: "Score Attack",
        matched: "Evenly Matched"
    },
    lobby: {
        title: "Connect The Stars",
        subtitle0: "An endless movie trivia game",
        subtitle1: "The Hollywood constellations game",
        subtitle2: "Hardcore movie trivia",
        subtitle3: "A game of conn-act-tions",
        subtitle4: "A spiderweb of stars",
        options: 'Options',
        load: 'Load',
        credits: 'Credits',
        resume: 'Resume',
        start: 'Start Game',
    },
    container: {
        one: 'One',
        two: 'Two',
        three: 'Three',
        four: 'Four',
        five: 'Five',
        six: 'Six',
        detour: 'Detour',
        max: 'Max',
        enter: 'Enter a Movie Star\'s Name',
        enter_short: 'Star\'s name',
        choose: 'Choose For Me',
        clear: 'Clear',
        popularity: 'Popularity'
    },
    help: {
        title: 'How To Play',
        classic1_title: 'The Goal',
        classic1: 'Figure out how two movie stars are connected through their films.',
        classic2_title: 'Expand Your Board',
        classic2: 'Build new connections by typing the names of movies & stars connected to the ones already in your board.',
        classic3_title: 'Connect The Stars',
        classic3: 'Challenge yourself to find the shortest path!'
    }
}

const fr: Dict<Dict<string>> = {
    mode: {
        classic: "Classique",
        detour: "Déviation",
        rising: "Célébrité Montante",
        value: "Seuil",
        person: "Achèvement",
        web: "Toile des stars",
        score: "Attaque de Score",
        matched: "Équilibré"
    },
    lobby: {
        title: "Connectez les Stars",
        subtitle0: "Un jeu-questionnaire sur les films sans fin",
        subtitle1: "Le jeu des constellations d'Hollywood",
        subtitle2: "Anecdotes sur les films hardcore",
        subtitle3: "Un jeu de connexions",
        subtitle4: "Une toile d'araignée d'stars",
        options: 'Options',
        load: 'Chargement',
        credits: 'Crédits',
        resume: 'Repris',
        start: 'Début du jeu',

    },
    container: {
        one: 'un',
        two: 'deux',
        three: 'trois',
        four: 'quatre',
        five: 'cinq',
        six: 'six',
        detour: 'déviation',
        max: 'maximum',
        enter: 'Saisir le nom d\'une star de cinéma',
        enter_short: 'Nom de la star',
        choose: 'Choisir pour moi',
        clear: 'Clair',
        popularity: 'Popularité'
    },
    help: {
        title: 'Comment Jouer',
        classic1_title: '',
        classic1: '',
        classic2_title: '',
        classic2: '',
        classic3_title: '',
        classic3: ''
    }
};

const LANGUAGE_LIST: Dict<Dict<Dict<string>>> = {
    'fr': fr
}

export const LANGUAGE_NAMES: Dict<string> = {
    'en': 'English',
    'fr': 'Français'
}

function getString(lang: string, key: string, params?: Dict<string>) {
    const [cat, spec] = key.split('.');
    let str = en[cat][spec];
    if (lang !== 'en' && lang in LANGUAGE_LIST) {
        str = LANGUAGE_LIST[lang][cat][spec];
    }
    if (!params)
        return str;
    for (const[k, v] of Object.entries(params))
        str = str.replace(k, v);
    return str;
}

export const useLanguage = (): [string, (code: string) => void, (key: string, params?: Dict<string>) => string] => {
    const [language, setLanguage] = useLocalStorage<string>('language', navigator.language.split('-')[0]);
    function _getString(key: string, params?: Dict<string>) {
        return getString(language, key, params);
    }

    return [language, setLanguage, _getString];
}

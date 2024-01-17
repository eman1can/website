import axios from 'axios';
import { find } from "../../utils";

import { Actor, AlternativeTitles, Film } from './types';
import {
    actorFromApiActor,
    actorsFromSearchActor,
    alternativeTitlesFromApiAlternativeTitles,
    filmFromApiFilm
} from "./utils";
const api_key = '2fd93a6ae014f8a40789924655c0c76d';

export function searchActor(query: string): Promise<Array<Actor>> {
    const params = { api_key: api_key, query: query}
    return new Promise<Array<Actor>>((resolve, reject) => {
        axios.get("https://api.themoviedb.org/3/search/person", {
            params: params
        }).then(r => {
            if (r.status == 200) {
                resolve(actorsFromSearchActor(r.data));
            } else {
                reject(new Error('Failed to fetch'));
            }
        })
    });
}

export function getData(query: { id: string }, credits?: boolean): Promise<Actor | Film> {
    return query.id.startsWith('a') ? getActor(query, credits) : getFilm(query, credits);
}

export function getActor(query: { id: string }, credits?: boolean): Promise<Actor> {
    const params: { api_key: string, append_to_response?: string } = {api_key: api_key};
    if (credits)
        params.append_to_response = 'credits';
    return new Promise<Actor>((resolve, reject) => {
        axios.get(`https://api.themoviedb.org/3/person/${query.id.substring(1)}`, {
            params: params
        }).then(r => {
            if (r.status == 200) {
                resolve(actorFromApiActor(r.data));
            } else {
                reject(new Error('Failed to fetch'));
            }
        });
    });
}

export function getFilm(query: { id: string }, credits?: boolean): Promise<Film> {
    const params: { api_key: string, append_to_response?: string } = {api_key: api_key};
    if (credits)
        params.append_to_response = 'credits, keywords';
    return new Promise<Film>((resolve, reject) => {
        axios.get(`https://api.themoviedb.org/3/movie/${query.id.substring(1)}`, {
            params: params
        }).then(r => {
            if (r.status == 200) {
                resolve(filmFromApiFilm(r.data));
            } else {
                reject(new Error('Failed to fetch'));
            }
        });
    });
}

export function getAlternateTitles(query: { id: string }): Promise<AlternativeTitles> {
    const params = { api_key: api_key };
    return new Promise<AlternativeTitles>((resolve, reject) => {
        axios.get(`https://api.themoviedb.org/3/movie/${query.id.substring(1)}/alternative_titles`,
            { params: params }
        ).then(r => {
            if (r.status == 200) {
                resolve(alternativeTitlesFromApiAlternativeTitles(r.data));
            } else {
                reject(new Error('Failed to fetch'));
            }
        });
    });
}

export function getHeadshot(query: string): string {
    if (query.endsWith('jpg')) {
        return `https://image.tmdb.org/t/p/w100_and_h100_bestv2${query}`;
    } else {
        return find('assets/cts', `${query}_sq.jpg`);
    }
}

export function getProfileImage(query: string, size: string = 'lg'): string {
    const key = {
        lg: "w600_and_h900",
        md: "w300_and_h450",
        sm: "w150_and_h225"
    }[size];
    if (query.endsWith('jpg')) {
        return `https://image.tmdb.org/t/p/${key}_bestv2${query}`;
    } else {
        return find('assets/cts', `${query}.jpg`);
    }
}

export function loadProfileImage(query: string): Promise<string> {
    return new Promise((resolve, reject) => {
        axios.get(getProfileImage(query), {

        }).then(r => {
            if (r.status == 200) {
                resolve(r.data);
            } else {
                reject(new Error('Failed to fetch'));
            }
        });
    });
}
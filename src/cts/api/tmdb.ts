import axios from 'axios';
import find from "../../utils";
import { ApiActor, ApiAlternativeTitles, ApiFilm, ApiSearchActor } from "./api_types";

const api_key = '2fd93a6ae014f8a40789924655c0c76d';

export function searchActor(query: string): Promise<ApiSearchActor> {
    const params = { api_key: api_key, query: query}
    return new Promise((resolve, reject) => {
        axios.get("https://api.themoviedb.org/3/search/person", {
            params: params
        }).then(r => {
            if (r.status == 200) {
                resolve(r.data);
            } else {
                reject();
            }
        })
    });
}

export function getActor(query: { id: string | number }, credits?: boolean): Promise<ApiActor> {
    const params: { api_key: string, append_to_response?: string } = {api_key: api_key};
    if (credits)
        params.append_to_response = 'credits';
    return new Promise<ApiActor>((resolve, reject) => {
        axios.get(`https://api.themoviedb.org/3/person/${query.id}`, {
            params: params
        }).then(r => {
            if (r.status == 200) {
                resolve(r.data);
            } else {
                reject();
            }
        });
    });
}

export function getFilm(query: { id: string }, credits?: boolean): Promise<ApiFilm> {
    const params: { api_key: string, append_to_response?: string } = {api_key: api_key};
    if (credits)
        params.append_to_response = 'credits, keywords';
    return new Promise<ApiFilm>((resolve, reject) => {
        axios.get(`https://api.themoviedb.org/3/movie/${query.id}`, {
            params: params
        }).then(r => {
            if (r.status == 200) {
                resolve(r.data);
            } else {
                reject();
            }
        });
    });
}

export function getAlternateTitles(query: { id: number }): Promise<ApiAlternativeTitles> {
    const params = { api_key: api_key };
    return new Promise((resolve, reject) => {
        axios.get(`https://api.themoviedb.org/3/movie/${query.id}/alternative_titles`,
            { params: params }
        ).then(r => {
            if (r.status == 200) {
                resolve(r.data);
            } else {
                reject();
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

// TODO: Vary size based upon input argument
export function getProfileImage(query: string): string {
    if (query.endsWith('jpg')) {
        return `https://image.tmdb.org/t/p/w600_and_h900_bestv2${query}`;
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
                reject();
            }
        });
    });
}
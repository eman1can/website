import axios from 'axios';
import find from "../utils";

const api_key = '2fd93a6ae014f8a40789924655c0c76d';
const offline = false;

export function searchActor(query: string) {
    if (offline) {
        if (query.toLowerCase().startsWith('s')) {
            return axios.get(find('assets/cts/offline', 'person2.json'));
        } else {
            return axios.get(find('assets/cts/offline', 'person.json'));
        }
    } else {
        return axios.get("https://api.themoviedb.org/3/search/person", {
            params: {
                api_key: api_key,
                query: query
            }
        });
    }
}

export function getActor(query: string) {
    if (offline) {
        return axios.get(find('assets/cts/offline', `${query}.json`));
    } else {
        return axios.get(` ${query}`, {
            params: {
                api_key: api_key,
            }
        });
    }
}

export function getHeadshot(query: string): string {
    if (offline) {
        return find('assets/cts/offline/sq', query);
    } else {
        if (query.endsWith('png')) {
            return `https://image.tmdb.org/t/p/w100_and_h100_bestv2${query}`;
        } else {
            return find('assets/cts', `${query}_sq.jpg`);
        }

    }
}

export function getProfileImage(query: string): string {
    if (query === '')
        return '';
    if (offline) {
        return find('assets/cts/offline/full', query);
    } else {
        if (query.endsWith('png')) {
            return `https://image.tmdb.org/t/p/w600_and_h900_bestv2${query}`;
        } else {
            return find('assets/cts', `${query}.jpg`);
        }

    }
}
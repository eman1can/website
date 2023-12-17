import axios from 'axios';

const api_key = '2fd93a6ae014f8a40789924655c0c76d';

export function searchActor(query: string) {
    console.log('Search', query);
    return axios.get("https://api.themoviedb.org/3/search/person", {
        params: {
            api_key: api_key,
            query: query
        }
    });
}

export function getActor(query: string) {
    return axios.get(`https://api.themoviedb.org/3/person/${query}`, {
        params: {
            api_key: api_key,
        }
    });
}

export function getProfileImage(query: string) {
    return axios.get(`https://image.tmdb.org/t/p/w600_and_h900_bestv2${query}`);
}
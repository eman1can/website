import { ActorCast, ApiActor, ApiAlternativeTitles, ApiFilm, ApiSearchActor, FilmCast } from "./api_types";
import { AlternativeTitles, Film, Actor } from "./types";
import { shouldFilterActor, shouldFilterFilm } from "../../utils";
import { SecretActors } from "../datasets";
import { GameType } from "../types";

export function actorsFromSearchActor(raw: ApiSearchActor): Array<Actor> {
    return raw.results.filter(a => a.profile_path).map(a => {
        return {
            id: `a${a.id}`,
            name: a.name,
            image: a.profile_path ? a.profile_path : '',
            popularity: a.popularity
        }
    });
}

export function filmFromFilmCast(raw: FilmCast): Film {
    return {
        id: `f${raw.id}`,
        name: raw.title,
        image: raw.poster_path ? raw.poster_path : '',
        popularity: raw.popularity
    };
}

export function actorFromActorCast(raw: ActorCast): Actor {
    return {
        id: `a${raw.id}`,
        name: raw.name,
        image: raw.profile_path ? raw.profile_path : '',
        popularity: raw.popularity
    };
}

export function actorFromApiActor(raw: ApiActor): Actor {
    return {
        id: `a${raw.id}`,
        name: raw.name,
        image: raw.profile_path ? raw.profile_path : '',
        popularity: raw.popularity,
        credits: raw.credits?.cast.filter(shouldFilterFilm).map(c => filmFromFilmCast(c))
    };
}

export function filmFromApiFilm(raw: ApiFilm): Film {
    return {
        id: `f${raw.id}`,
        name: raw.title,
        image: raw.poster_path ? raw.poster_path : '',
        popularity: raw.popularity,
        credits: raw.credits?.cast.filter(shouldFilterActor).map(c => actorFromActorCast(c))
    }
}

export function alternativeTitlesFromApiAlternativeTitles(raw: ApiAlternativeTitles): AlternativeTitles {
    return {
        id: `f${raw.id}`,
        titles: raw.titles.map(t => t.title)
    }
}

export function filterActors(r: Array<GameType>, query: string, current: Array<string>): Array<GameType> {
    const filteredForPhotos = r.filter(item => item.name.length > 1 && !current.includes(item.id));

    for (const option of SecretActors) {
        if (query.toLowerCase() === option.name)
            filteredForPhotos.push(option);
    }

    return filteredForPhotos.slice(0, 7);
}
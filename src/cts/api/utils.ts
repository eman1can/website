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
            popularity: a.popularity,
            genres: [],
            keywords: []
        }
    });
}

export function filmFromFilmCast(raw: FilmCast): Film {
    return {
        id: `f${raw.id}`,
        name: raw.title,
        image: raw.poster_path ? raw.poster_path : '',
        popularity: raw.popularity,
        genres: raw.genre_ids,
        keywords: []
    };
}

export function actorFromActorCast(raw: ActorCast): Actor {
    return {
        id: `a${raw.id}`,
        name: raw.name,
        image: raw.profile_path ? raw.profile_path : '',
        popularity: raw.popularity,
        genres: [],
        keywords: []
    };
}

export function actorFromApiActor(raw: ApiActor): Actor {
    return {
        id: `a${raw.id}`,
        name: raw.name,
        image: raw.profile_path ? raw.profile_path : '',
        popularity: raw.popularity,
        credits: raw.credits?.cast.filter(shouldFilterFilm).map(c => filmFromFilmCast(c)),
        genres: [],
        keywords: []
    };
}

export function filmFromApiFilm(raw: ApiFilm): Film {
    console.log('Raw', raw);
    return {
        id: `f${raw.id}`,
        name: raw.title,
        image: raw.poster_path ? raw.poster_path : '',
        popularity: raw.popularity,
        credits: raw.credits?.cast.filter(shouldFilterActor).map(c => actorFromActorCast(c)),
        genres: raw.genres.map(g => g.id),
        keywords: raw.keywords ? raw.keywords.keywords.map(k => k.name) : []
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

export function copyTextToClipboard(text: string, onSuccess: () => void, onError: () => void) {
    function fallbackCopyTextToClipboard(text: string) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand("copy");
            onSuccess && onSuccess();
        } catch (err) {
            onError && onError();
        }

        document.body.removeChild(textArea);
    }

    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(
        function() {
            onSuccess && onSuccess();
        },
        function(err) {
            onError && onError();
        }
    );
}
import { Actor } from "../types";
import { ApiActor, ApiSearchActor } from "./api_types";

export function filterActors(r: ApiSearchActor, query: string, current: Array<number | undefined>): null | Actor[] {
    const filteredForPhotos: Actor[] = r.results.filter(
        (star: any) => {
            return star.profile_path != null && star.name.length > 1 && !current.includes(star.id);
        });

    if (query.toLowerCase() === "eric bai") {
        filteredForPhotos.push({name: "Eric Bai", id: -1, popularity: 0, profile_path: 'eric'});
    } else if (query.toLowerCase() === "amanda hum") {
        filteredForPhotos.push({name: "Amanda Hum", id: -2, popularity: 0, profile_path: 'amanda'});
    } else if (query.toLowerCase() === "ethan wolfe") {
        filteredForPhotos.push({name: "Ethan Wolfe", id: -3, popularity: 0, profile_path: 'ethan'});
    }

    if (filteredForPhotos.length > 0) {
        return filteredForPhotos.slice(0, 7);
    }

    return null;
}


export function find(p: string, name: string) {
    return `${process.env.PUBLIC_URL}/${p}/${name}`;
}

export function shouldFilterFilm(film: { poster_path: string | null, release_date: string | null, genre_ids: Array<number>}): boolean {
    const today = new Date();
    return film.poster_path != null // film must have a poster
        && new Date(film.release_date ? film.release_date : '') <= today // film must be released
        && !film.genre_ids.includes(99); // film must not be a documentary
}

export function shouldFilterActor(actor: { profile_path: string | null }) {
    return actor.profile_path !== null;
}


// export function compileAlternateTitles(films: Dict<FilmCast>): Promise<Array<AlternativeTitles>> {
//     const filmSet: Set<{ id: number, title: string }> = new Set(Object.values(films).map(f => ({id: f.id, title: f.title})));
//     const shouldGetAlternate: Array<{ id: number, title: string }> = Array.from(filmSet).filter(f => {
//         return f.title.match(ALTERNATE_TITLE_FILTER);
//     });
//     return Promise.all(shouldGetAlternate.map(f => getAlternateTitles(f))).then(r => {
//         const altTitles = r.map((r, i) => {
//             r.titles = r.titles.filter((t: { iso_3166_1: string }) =>
//                 ["US", "GB"].includes(t.iso_3166_1)
//             );
//             return {
//                 ...r,
//                 mainTitle: shouldGetAlternate[i].title
//             };
//         }).filter(f => f.titles.length > 0);
//
//         const map: Map = {};
//         altTitles.forEach(alt => {
//             const mainTitle = toGraphKey(alt.mainTitle);
//             alt.titles
//                 .map((o: { title: string }) => o.title)
//                 .forEach((t: string) => {
//                     const altKey = toGraphKey(t);
//                     if (!altKey.startsWith(mainTitle)) {
//                         insertNodeToMap(
//                             map,
//                             {id: alt.id, key: mainTitle},
//                             altKey
//                         );
//                     }
//                 });
//         });
//         return map;
//     });
// }

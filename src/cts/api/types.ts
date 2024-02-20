export type Actor = {
    id: string
    name: string
    image: string
    popularity: number
    credits?: Array<Film>
    genres: Array<number>
}

export type Film = {
    id: string
    name: string
    image: string
    popularity: number
    credits?: Array<Actor>
    genres: Array<number>
}

export type AlternativeTitles = {
    id: string
    titles: Array<string>
}

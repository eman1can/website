export type Actor = {
    id: string
    name: string
    image: string
    popularity: number
    credits?: Array<Film>
    genres: Array<number>
    keywords: Array<string>
}

export type Film = {
    id: string
    name: string
    image: string
    popularity: number
    credits?: Array<Actor>
    genres: Array<number>
    keywords: Array<string>
}

export type AlternativeTitles = {
    id: string
    titles: Array<string>
}

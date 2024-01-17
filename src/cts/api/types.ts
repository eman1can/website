export type Actor = {
    id: string
    name: string
    image: string
    popularity: number
    credits?: Array<Film>
}

export type Film = {
    id: string
    name: string
    image: string
    popularity: number
    credits?: Array<Actor>
}

export type AlternativeTitles = {
    id: string
    titles: Array<string>
}

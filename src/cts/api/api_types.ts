type Genre = {
    id: number
    name: string
}

type ProductionCompany = {
    id: number
    name: string
    logo_path: string
    origin_country: string
}

type ProductionCountry = {
    iso_3166_1: string
    name: string
}

type Language = {
    english_name: string
    name: string
    iso_639_1: string
}

type ActorCast = {
    id: number
    name: string
    popularity: number
    profile_path: string | null
    gender: 0 | 1 | 2 | 3
    adult: boolean
    known_for_department: string
    original_name: string
    character: string
    credit_id: string
    cast_id: number
    order: number
}

export type FilmCast = {
    id: number
    title: string
    popularity: number
    adult: boolean
    video: boolean
    order: number
    overview: string
    character: string
    credit_id: string
    vote_average: number
    vote_count: number
    original_title: string
    original_language: string
    release_date: string | null
    backdrop_path: string | null
    poster_path: string | null
    genre_ids: Array<number>
}

type FilmCrew = {
    id: number
    title: string
    popularity: number
    adult: boolean
    video: boolean
    overview: string
    job: string
    department: string
    credit_id: string
    vote_average: number
    vote_count: number
    original_title: string
    original_language: string
    release_date: string | null
    backdrop_path: string | null
    poster_path: string | null
    genre_ids: Array<number>
}

type ActorCrew = {
    id: number
    name: string
    popularity: number
    profile_path: string | null
    gender: 0 | 1 | 2 | 3
    adult: boolean
    known_for_department: string
    original_name: string
    job: string
    department: string
    credit_id: string
}

export type ApiFilm = {
    id: number
    title: string
    popularity: number
    adult: boolean
    video: boolean
    budget: number
    revenue: number
    runtime: number
    original_language: string
    original_title: string
    status: string
    overview: string
    tagline: string
    vote_average: number
    vote_count: number
    homepage: string | null
    release_date: string | null
    imdb_id: string | null
    poster_path: string | null
    backdrop_path: string | null
    belongs_to_collection: string | null
    genres: Array<Genre>
    spoken_languages: Array<Language>
    production_companies: Array<ProductionCompany>
    production_countries: Array<ProductionCountry>
    credits?: {
        cast: Array<ActorCast>
        crew: Array<ActorCrew>
    }
    keywords?: {
        keywords: Array<string>
    }
}

export type ApiActor = {
    id: number
    name: string
    popularity: number
    profile_path: string | null
    adult: boolean
    gender: 0 | 1 | 2 | 3
    known_for_department: string
    biography: string
    birthday: string
    imdb_id: string
    place_of_birth: string
    deathday: string | null
    homepage: string | null
    also_known_as: Array<string>
    credits?: {
        cast: Array<FilmCast>
        crew: Array<FilmCrew>
    }
}

type AlternativeTitle = {
    iso_3166_1: string
    title: string
    type: string
}

export type ApiAlternativeTitles = {
    id: number
    titles: Array<AlternativeTitle>
}

type SearchFilm = {
    id: number
    title: string
    popularity: number
    adult: boolean
    backdrop_path: string | null
    poster_path: string | null
    original_language: string
    original_title: string
    overview: string
    media_type: string
    release_date: string
    video: boolean
    vote_average: number
    vote_count: number
    genre_ids: Array<number>
}

type SearchActor = {
    id: number
    name: string
    adult: boolean
    original_name: string
    popularity: number
    profile_path: string | null
    known_for_department: string
    gender: 0 | 1 | 2 | 3
    known_for: Array<SearchFilm>
}

export type ApiSearchActor = {
    page: number
    total_pages: number
    total_results: number
    results: Array<SearchActor>
}
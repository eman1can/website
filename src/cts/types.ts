import React from "react";
import { FilmCast } from "./api/api_types";

export type Actor = {
    id: number,
    name: string,
    profile_path: string | null,
    popularity: number
}

export type Film = {
    id: number,
    title: string,
    poster_path: string | null,
    popularity: number
}

export type Dict<S> = {[key: string]: S};

export type Node = {
    id: number,
    key: string
}

export type Map = Dict<Array<Node>>

export type GameData = {
    mode: string,
    subMode: string,
    found: {actors: Dict<Actor>, films: Dict<Film>},
    answers: {actors: Dict<Actor>, films: Dict<Film>},
    filmMap: Map,
    requires: Array<Actor>
}

export type HowToPlayButtonProps = {
    mobile: boolean
    showIcon?: boolean
}

export type LobbyProps = {
    mobile: boolean
    showHowToPlay: boolean
    setShowHowToPlay: ((newValue: boolean) => void)
    HowToPlayButton: ((props: HowToPlayButtonProps) => React.JSX.Element)
    showResume: boolean
    setShowResume: ((newValue: boolean) => void)
    setGameData: ((newData: GameData) => void)
}
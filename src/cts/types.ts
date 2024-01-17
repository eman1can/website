import React from "react";
import { FilmCast } from "./api/api_types";
import { Actor, AlternativeTitles, Film } from "./api/types";

export type Dict<S> = {[key: string]: S};

export type GameType = Actor | Film;

export type GameData = {
    mode: string
    subMode: string
    found: Array<string>
    pool: Dict<GameType>
    altTitles: Dict<Array<string>>
    requires: Dict<string>
    bestPath?: number
}


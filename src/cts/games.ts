export const SubTitles: string[] = [
    "An endless movie trivia game",
    "The Hollywood constellations game",
    "Hardcore movie trivia",
    "A game of conn-act-tions",
    "A spiderweb of stars"
]
export const GameNames: {[key: string]: string} = {
    classic: 'Classic',
    detour: 'Detour',
    rising: 'Rising Stardom',
    web: 'Web of Stars',
    rising_Value: 'Max Value',
    rising_Person: 'Below Person'
}

export const GameTypes: {[key: string]: {default: string, modes?: string[], containers: {[key: string]: string[]}}} = {
    // Connect two actors together
    classic: {default: '', containers: {'': ['one', 'two']}},
    // Connect two actors to a third actor
    detour: {default: '', containers: {'': ['one', 'detour', 'two']}},
    rising: {default: 'Value', modes: ['Value', 'Person'], containers: {Value: ['one', 'two'], Person: ['one', 'two', 'max']}},
    web: {default: '', containers: {'': ['one', 'two', 'three', 'four', 'five', 'six']}}
}

import {State} from "../Bot";

export const playerList = (state: State) => {
    if (!state.game) return 'emptyPlayerList'
    return `Игроки (${state.game.players.length}):\n`
        + state.game.players.map(e => `[${e.name}](tg://user?id=${e.id})`).join('\n')
}
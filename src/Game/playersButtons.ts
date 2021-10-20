import {Player} from "../Player/Player";

const generateInlineKeyboard = (players: Player[]) => ({
        inline_keyboard: players.map(player => [{text: player.name, callback_data: String(player.id)}])
    }
)

export const alivePlayersButtons = (players: Player[]) => generateInlineKeyboard(players.filter(e => e.isAlive)) // is it needed?
export const deadPlayersButtons = (players: Player[]) => generateInlineKeyboard(players.filter(e => !e.isAlive))
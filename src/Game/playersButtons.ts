import {Player} from "../Player/Player";

const generateInlineKeyboard = (players: Player[]) => ({
        inline_keyboard: players.map(player => [{text: player.name, callback_data: String(player.id)}])
    }
)

export const alivePlayersButtons = (players: Player[], ...exception_players: Player[]) =>
    generateInlineKeyboard(players.filter(e => e.isAlive && !exception_players.includes(e))) // is it needed?
export const deadPlayersButtons = (players: Player[]) => generateInlineKeyboard(players.filter(e => !e.isAlive))
import {Player} from "../Player/Player";

const generateInlineKeyboard = (players: Player[]) => ({
        inline_keyboard: players.map(player => [{text: player.name, callback_data: String(player.id)}])
    }
)

export const playersButtons = (players: Player[], alive: boolean, ...exceptionPlayers: Player[]) => {
    return generateInlineKeyboard(players.filter(e => e.isAlive === alive && !exceptionPlayers.includes(e)));
}
import {Player} from "../Player/Player";

export const generateInlineKeyboard = (players: Player[], withSkip = true) => {
    const output = players.map(player => [{text: player.name, callback_data: String(player.id)}]);
    output.push([{text: 'Пропустить', callback_data: 'Пропустить'}]);
    return output;
}
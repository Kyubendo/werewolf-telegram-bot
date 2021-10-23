import {Player} from "../Player/Player";

export const generateInlineKeyboard = (players: Player[], withSkip = true) => {
    const output = {
        inline_keyboard: players.map(player => [{text: player.name, callback_data: String(player.id)}])
    };
    withSkip && output.inline_keyboard.push([{text: 'Пропустить', callback_data: String('Пропустить')}]);
    return output
}
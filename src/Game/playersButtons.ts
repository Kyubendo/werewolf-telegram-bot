import {Player} from "../Player/Player";

export const generateInlineKeyboard = (players: Player[], withSkip = true, type: string = 'role') => {
    const output = {
        inline_keyboard: players.map(player => [{
            text: player.name,
            callback_data: JSON.stringify({type, choice: player.id})
        }])
    };
    withSkip && output.inline_keyboard.push([{
        text: 'Пропустить',
        callback_data: JSON.stringify({type, choice: 'skip'})
    }]);
    return output
}
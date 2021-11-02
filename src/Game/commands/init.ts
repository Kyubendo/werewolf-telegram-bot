import TelegramBot from "node-telegram-bot-api";
import {Game} from "../Game";
import {Player} from "../../Player/Player";
import {State} from "../../Bot";
import {Lynch} from "../Voting/Lynch";
import {WolfFeast} from "../Voting/WolfFeast";
import {startPlayerList} from "../../Utils/playerLists";

const joinButton = {
    inline_keyboard: [
        [{text: 'Присоединиться', callback_data: JSON.stringify({type: 'join'}),}]
    ]
}

const features = [
    'Добавлен список фич.',
    'Добавлен таймер отмены игры.',
    'Добавлена доска с предложениями и багами.'
]

const messageAppend = (features.length
        ? '\n\n*Новые фичи:*\n' + features.map(feature => `_${feature}_`).join('\n')
        : '')
    + '\n\n[Баги и предложения сюда](https://trello.com/invite/b/cnBejMgi/38d6f76319eff47662ca0836f496c0d4/werewolf-bot-public)'

export const initGame = (bot: TelegramBot, state: State) => {
    bot.onText(/\/start_classic/, msg => {
        if (msg.chat.type === 'private' || msg.chat.type === 'channel') return;
        if (!msg.from) return;
        if (state.game) {
            bot.sendMessage(
                msg.chat.id,
                'Игру уже запустили, просто нажми на кнопку.',
                {
                    reply_markup: joinButton
                })
            return;
        }

        let endGameTimeout: NodeJS.Timer | undefined
        const onEnd = () => {
            endGameTimeout && clearTimeout(endGameTimeout)
            delete state.game
        }
        endGameTimeout = setTimeout(() => {
            if (state.game && !state.game?.stage) {
                bot.sendMessage(state.game.chatId, 'Время вышло, игра отменяется!')
                onEnd()
            }
        }, 600_000)

        state.game = new Game('classic', bot, [new Player(msg.from)], msg.chat.id, onEnd, 0)
        state.game.lynch = new Lynch(state.game)
        state.game.wolfFeast = new WolfFeast(state.game)

        bot.sendAnimation(
            msg.chat.id,
            'https://media.giphy.com/media/ZLdy2L5W62WGs/giphy.gif',
            {
                caption: `Новая игра начата игроком ${msg.from?.first_name +
                    (msg.from.last_name ? ' ' + msg.from.last_name : '')}!\nУ тебя есть десять минут, чтобы` +
                    ` присоединиться и быть съеденным(ой)!${messageAppend}`,
                reply_markup: joinButton,
            }
        ).then(msg => bot.pinChatMessage(msg.chat.id, String(msg.message_id)))
        bot.sendMessage(
            msg.chat.id,
            startPlayerList(state.game.players),
        ).then(msg => state.game!.playerCountMsgId = msg.message_id)
    })
}

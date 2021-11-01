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
        const onEnd = () => delete state.game
        state.game = new Game('classic', bot, [new Player(msg.from)], msg.chat.id, onEnd, 0)
        state.game.lynch = new Lynch(state.game)
        state.game.wolfFeast = new WolfFeast(state.game)

        bot.sendAnimation(
            msg.chat.id,
            'https://media.giphy.com/media/ZLdy2L5W62WGs/giphy.gif',
            {
                caption: `Новая игра начата игроком ${msg.from?.first_name +
                    (msg.from.last_name ? ' ' + msg.from.last_name : '')}! Присоединяйся, чтобы` +
                    ` быть съеденным(ой)!`,
                reply_markup: joinButton,
            }
        ).then(msg => bot.pinChatMessage(msg.chat.id, String(msg.message_id)))
        bot.sendMessage(
            msg.chat.id,
            startPlayerList(state.game.players),
        ).then(msg => state.game!.playerCountMsgId = msg.message_id)
    })
}

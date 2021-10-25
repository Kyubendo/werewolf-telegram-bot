import TelegramBot from "node-telegram-bot-api";
import {Game} from "../Game";
import {Player} from "../../Player/Player";
import {State} from "../../Bot";
import {playerList} from "../../Utils/playerList";
import {Lynch} from "../Voting/Lynch";

const joinButton = {
    inline_keyboard: [
        [{text: 'Присоединиться', callback_data: 'join',}]
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

        state.game = new Game('classic', bot, [new Player(msg.from)], msg.chat.id, 0)
        state.game.lynch = new Lynch(state.game)

        bot.sendMessage(
            msg.chat.id,
            `Новая игра начата игроком ${msg.from?.first_name +
            (msg.from.last_name ? ' ' + msg.from.last_name : '')}! Присоединяйся, чтобы` +
            ` быть съеденным(ой)!.`,
            {
                reply_markup: joinButton,
            }
        )//.then(msg => bot.pinChatMessage(msg.chat.id, String(msg.message_id)))
        bot.sendMessage(
            msg.chat.id,
            playerList(state.game),
        ).then(msg => state.game!.playerCountMsgId = msg.message_id)
    })
}

import TelegramBot from "node-telegram-bot-api";
import {State} from "../Bot";

export const autoDelete = (bot: TelegramBot, state: State) => {
    bot.onText(/.+/, msg => {
        if (state.game?.players
            .filter(p => !p.isAlive)
            .map(p => p.id)
            .includes(msg.from?.id || 0)) { // multichat
            bot.deleteMessage(msg.chat.id, String(msg.message_id))
        }
    })
}


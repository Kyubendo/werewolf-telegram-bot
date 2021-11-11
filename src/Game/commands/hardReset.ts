import TelegramBot from "node-telegram-bot-api";
import {State} from "../../Bot";

export const hardReset = (bot: TelegramBot, state: State) => {
    bot.onText(/\/hard_reset/, msg => {
        if (msg.from?.id === 305891812) delete state.game;
    })
}

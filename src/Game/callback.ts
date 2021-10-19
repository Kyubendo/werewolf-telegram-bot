import TelegramBot from "node-telegram-bot-api";
import {State} from "../Bot";
import {join} from "./join";

export const callbackHandle = (bot: TelegramBot, state: State) => {
    bot.on('callback_query', query => {
        switch (query.data) {
            case 'join':
                join(bot, state, query)
                break
        }
    })
}

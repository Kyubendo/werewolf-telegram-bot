import TelegramBot from "node-telegram-bot-api";
import {join} from "./join";
import {State} from "../Bot";

export const callbackHandle = (bot: TelegramBot, state: State) => {
    bot.on('callback_query', query => {
        const game = state.game
        if (!game) return
        switch (query.data) {
            case 'join':
                join(bot, game, query)
                break
        }
    })
}

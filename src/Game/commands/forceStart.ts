import TelegramBot from "node-telegram-bot-api";
import {State} from "../../Bot";
import {gameStart} from "../gameStart";

export const forceStart = (bot: TelegramBot, state: State) => {
    bot.onText(/\/force_start/, msg => {
        const game = state.game
        if (!game) return;
        gameStart(bot, game)
    })
}

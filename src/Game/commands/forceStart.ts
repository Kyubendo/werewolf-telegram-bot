import TelegramBot from "node-telegram-bot-api";
import {State} from "../../Bot";
import {gameStart} from "../gameStart";

export const forceStart = (bot: TelegramBot, state: State) => {
    bot.onText(/\/force_start/, () => {
        const game = state.game
        if (!game || game.stage) return;
        if (!process.env.ROLE_TEST && game.players.length < 6) {
            bot.sendMessage(game.chatId, 'Нельзя начать игру на 5 и меньше игроков!')
            return;
        }
        gameStart(bot, game)
    })
}

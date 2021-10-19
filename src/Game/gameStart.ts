import TelegramBot from "node-telegram-bot-api";
import {assignRoles} from "./roleAssign";
import {changeStage} from "./changeStage";
import {Game} from "./Game";
import {State} from "../Bot";

export const gameStart = (bot: TelegramBot, game: Game) => {
    changeStage(bot, game)
    assignRoles(bot, game)
}

export const forceStart = (bot: TelegramBot, state: State) => {
    bot.onText(/\/force_start/, msg => {
        const game = state.game
        if (!game) return;
        gameStart(bot, game)
    })
}

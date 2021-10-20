import TelegramBot from "node-telegram-bot-api";
import {assignRoles} from "./roleAssign";
import {changeStage} from "./changeStage";
import {Game} from "./Game";

export const gameStart = (bot: TelegramBot, game: Game) => {
    assignRoles(bot, game)
    changeStage(bot, game)
}


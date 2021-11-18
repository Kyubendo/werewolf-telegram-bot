import TelegramBot from "node-telegram-bot-api";
import {assignRoles} from "./roleAssign";
import {Game} from "./Game";

export const gameStart = (bot: TelegramBot, game: Game) => {
    assignRoles(game).then(() => game.setNextStage())
}

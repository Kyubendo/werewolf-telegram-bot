import TelegramBot from "node-telegram-bot-api";
import {assignRoles} from "./roleAssign";
import {Game} from "./Game";

export const gameStart = (bot: TelegramBot, game: Game) => {
    game.started = true
    assignRoles(game).then(() => {
        game.gameStartedTime = (new Date).getTime();
        game.setNextStage()
    })
}

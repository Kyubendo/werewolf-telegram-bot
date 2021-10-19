import TelegramBot from "node-telegram-bot-api";
import {State} from "../Bot";
import {gameStageMsg} from "./gameStageMsg";
import {assignRoles} from "./roleAssign";
import {playerList} from "./playerList";
import {changeStage} from "./changeStage";

export const gameStart = (bot: TelegramBot, state: State) => {
    if (!state.game) return;
    changeStage(bot, state)
    assignRoles(bot, state)
}

export const forceStart = (bot: TelegramBot, state: State) => {
    bot.onText(/\/force_start/, msg => {
        gameStart(bot, state)
    })
}

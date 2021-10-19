import TelegramBot from "node-telegram-bot-api";
import {State} from "../Bot";
import {gameStageMsg} from "./gameStageMsg";
import {assignRoles} from "./roleAssign";
import {playerList} from "./playerList";

export const gameStart = (bot: TelegramBot, state: State) => {
    if (!state.game) return;
    //if (playerList())
    state.game.nextStage();
    bot.sendMessage(state.chatId, gameStageMsg(state.game.stage) || '')
        .then(() => {
            bot.sendMessage(state.chatId, playerList(state.game!), {parse_mode: 'Markdown'})
        })
    assignRoles(bot, state.game.players)
}

export const forceStart = (bot: TelegramBot, state: State) => {
    bot.onText(/\/force_start/, msg => {
        gameStart(bot, state)
    })
}

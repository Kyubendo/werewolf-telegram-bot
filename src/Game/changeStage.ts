import {Game} from "./Game";
import {gameStageMsg} from "./gameStageMsg";
import {playerList} from "./playerList";
import {State} from "../Bot";
import TelegramBot from "node-telegram-bot-api";

export const changeStage = (bot: TelegramBot, state: State) => {
    if (!state.game) return
    state.game.setNextStage();
    bot.sendMessage(state.chatId, gameStageMsg(state.game.stage) || '')
        .then(() => {
            bot.sendMessage(state.chatId, playerList(state.game!), {parse_mode: 'Markdown'})
        })
    state.game.players.forEach(player => {
        if (!player.isAlive || player.isFrozen) return
        if (state.game?.stage === 'night') player.role?.nightAction && player.role?.nightAction()
        else if (state.game?.stage === 'day') player.role?.dayAction && player.role.dayAction()
    })

}
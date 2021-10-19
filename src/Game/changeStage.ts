import {Game} from "./Game";
import {gameStageMsg} from "./gameStageMsg";
import {playerList} from "./playerList";
import TelegramBot from "node-telegram-bot-api";

export const changeStage = (bot: TelegramBot, game: Game) => {
    game.setNextStage();
    bot.sendMessage(game.chatId, gameStageMsg(game.stage) || '')
        .then(() => {
            bot.sendMessage(game.chatId, playerList(game), {parse_mode: 'Markdown'})
        })
    game.players.filter(player => player.isAlive || !player.isFrozen).forEach(player => {
        if (game.stage === 'night') player.role?.nightAction && player.role?.nightAction()
        else if (game.stage === 'day') player.role?.dayAction && player.role.dayAction()
    })
}
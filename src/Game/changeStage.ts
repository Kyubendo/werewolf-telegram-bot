import {Game} from "./Game";
import {gameStageMsg} from "./gameStageMsg";
import {playerList} from "./playerList";
import TelegramBot from "node-telegram-bot-api";

export const changeStage = ( game: Game) => {
    game.players.filter(player => player.isAlive)
        .forEach(player => player.role?.actionResolve && player.role?.actionResolve())
    game.setNextStage();
    game.bot.sendMessage(game.chatId, gameStageMsg(game.stage) || '')
        .then(() => {
            game.bot.sendMessage(game.chatId, playerList(game), {parse_mode: 'Markdown'})
        })
    game.players.filter(player => player.isAlive || !player.isFrozen)
        .forEach(player => player.role?.action && player.role.action())
}
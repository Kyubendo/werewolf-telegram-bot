import {SelectType} from "../commands/callbackHandle";
import {Game} from "../Game";
import {findPlayer} from "../findPlayer";
import {playerLink} from "../../Utils/playerLink";
import {joinButton} from "../commands/startGame";
import {startPlayerList} from "../../Utils/playerLists";

export const leave = async (game: Game, select: SelectType) => {
    const leavingPlayer = findPlayer(select.from.id, game.players)
    if (!leavingPlayer || !game.players.map(e => e.id).includes(leavingPlayer.id)) return;

    if (!game.stage) {
        await game.bot.sendMessage(game.chatId,
            `${playerLink(leavingPlayer)} сбежал в ужасе! Он испугался умереть в первую ночь.`,
            {
                reply_markup: joinButton
            })
        await game.bot.sendMessage(leavingPlayer.id, 'Тебе удалось сбежать из села! Но ещё не поздно вернутся!',
            {
                reply_markup: joinButton,
            })
        await game.removePlayer(leavingPlayer);
        await game.bot.editMessageText(startPlayerList(game.players), {
            message_id: game.playerCountMsgId,
            chat_id: game.chatId,
        })
    } else if (!leavingPlayer.hasLeft) {
        const leaveStringArr = [`При попытке сбежать из села ${playerLink(leavingPlayer)}` +
        `наткнулся(лась) на невидимый барьер. ` +
        `Он(а) понял(а), что пока конфликт не закончится, покинуть это место не удасться...`,
            `${playerLink(leavingPlayer)} попытался(лась) убежать из села, но спустя несколько часов блужданий понял(а), ` +
            `что ходит кругами. Так просто покинуть это заколдованное место не выйдет...`,
            `${playerLink(leavingPlayer)}, администратор *Kyubendo* отклонил ваш запрос покинуть игру. ` +
            `Придётся мучаться дальше.`]
        await game.bot.sendMessage(game.chatId,
            leaveStringArr[Math.floor(Math.random() * leaveStringArr.length)])
    }
}
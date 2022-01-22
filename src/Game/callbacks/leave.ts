import {SelectType} from "../commands/callbackHandle";
import {Game} from "../Game";
import {findPlayer} from "../findPlayer";
import {playerLink} from "../../Utils/playerLink";
import {joinButton} from "../commands/startGame";
import {startPlayerList} from "../../Utils/playerLists";
import {checkEndGame} from "../checkEndGame";

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
        await game.bot.sendMessage(game.chatId,
            `*${leavingPlayer.role?.roleName}* надоело всё происходящее в селе и он(а) убежал(а) сломя голову!\n` +
            `${playerLink(leavingPlayer)} проиграл(а).`)
        await game.bot.sendMessage(leavingPlayer.id, 'Тебе удалось сбежать из села! Кстати, ты проиграл!');
        leavingPlayer.hasLeft = true;
        const endGame = checkEndGame(game.players, game.stage)
        if (!process.env.ROLE_TEST && endGame) {
            await game.onGameEnd(endGame)
            return
        }
    }
}
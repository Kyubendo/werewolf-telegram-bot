import {SelectType} from "../commands/callbackHandle";
import {Game} from "../Game";
import {findPlayer} from "../findPlayer";
import {playerLink} from "../../Utils/playerLink";
import {joinButton} from "../commands/startGame";
import {startPlayerList} from "../../Utils/playerLists";
import {randomElement} from "../../Utils/randomElement";
import {Player} from "../../Player/Player";

const removePlayer = async (game: Game, player: Player) => {
    if (game.stage) return;
    const index = game.players.indexOf(player, 0);
    if (index > -1) game.players.splice(index, 1);
}

export const leave = async (game: Game, select: SelectType) => {
    const leavingPlayer = findPlayer(select.from.id, game.players)
    if (!leavingPlayer || !game.players.map(e => e.id).includes(leavingPlayer.id)) return;

    if (!game.stage) {
        await game.bot.sendMessage(game.chatId,
            `${playerLink(leavingPlayer)} сбежал(а) в ужасе испугавшись умереть в первую ночь!`,
            {
                reply_markup: joinButton
            })
        await game.bot.sendMessage(leavingPlayer.id, 'Тебе удалось сбежать из села! Но ещё не поздно вернутся!',
            {
                reply_markup: joinButton,
            })
        await removePlayer(game, leavingPlayer);
        await game.bot.editMessageText(startPlayerList(game.players), {
            message_id: game.playerCountMsgId,
            chat_id: game.chatId,
        })
    }
}
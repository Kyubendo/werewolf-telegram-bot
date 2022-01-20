import {Player} from "../../Game";
import {Game} from "../Game";
import {playerLink} from "../../Utils/playerLink";
import {SelectType} from "../commands/callbackHandle";
import {startPlayerList} from "../../Utils/playerLists";
import {msToMinutes} from "../../Utils/msToMinutes";
import {joinButton} from "../commands/startGame";

export const join = async (game: Game, select: SelectType) => {
    if (game.stage) return;
    const newPlayer = new Player(select.from)
    if (game.players.map(e => e.id).includes(newPlayer.id)) return;
    await game.addPlayer(newPlayer)
    game.startGameTimer.extend(60_000)
    await game.bot.sendMessage(game.chatId,
        `${playerLink(newPlayer)} теперь в игре! Время увеличено, `
        + `осталось *${msToMinutes(game.startGameTimer.getRemainingTime())}* до начала игры.`,
        {
            reply_markup: joinButton
        })
    await game.bot.editMessageText(startPlayerList(game.players), {
        message_id: game.playerCountMsgId,
        chat_id: game.chatId,
    })
    game.bot.sendMessage(newPlayer.id, 'Ты успешно присоединился к игре!')
        .catch(reason => {
            if (reason.response.statusCode === 403) {
                game.bot.sendMessage(
                    game.chatId,
                    `${playerLink(newPlayer)}, чтобы я смог тебе писать, надо меня запустить.`,
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [{text: 'Запустить', url: `telegram.me/${process.env.BOT_NAME}?start=start`,}]
                            ],
                        }
                    },
                )
            }
        })
}

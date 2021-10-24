import TelegramBot from "node-telegram-bot-api";
import {Player} from "../../Player/Player";
import {playerList} from "../playerList";
import {Game} from "../Game";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export const join = (game: Game, query: TelegramBot.CallbackQuery) => {
    const newPlayer = new Player(query.from)
    if ( game.players.map(e => e.id).includes(newPlayer.id)) return;
    game.addPlayer(newPlayer)
    game.bot.editMessageText(playerList(game), {
        message_id: game.playerCountMsgId,
        chat_id: game.chatId,
    })
    game.bot.sendMessage(newPlayer.id, 'Ты успешно присоединился к игре!')
        .catch(reason => {
            if (reason.response.statusCode === 403) {
                game.bot.sendMessage(
                    game.chatId,
                    `${highlightPlayer(newPlayer)}, чтобы я смог тебе писать, надо меня запустить.`,
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

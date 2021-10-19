import TelegramBot from "node-telegram-bot-api";
import {Player} from "../Player/Player";
import {playerList} from "./playerList";
import {State} from "../Bot";

export const join = (bot: TelegramBot, state: State, query: TelegramBot.CallbackQuery) => {
    const newPlayer = new Player(query.from)
    if (!state.game || state.game.players.map(e => e.id).includes(newPlayer.id)) return
    state.game.addPlayer(newPlayer)
    bot.editMessageText(playerList(state.game), {
        message_id: state.playerCountMsgId,
        chat_id: state.chatId,
        parse_mode: 'Markdown'
    })
    bot.sendMessage(newPlayer.id, 'Ты успешно присоединился у игре!')
        .catch(reason => {
            if (reason.response.statusCode === 403) {
                bot.sendMessage(
                    state.chatId,
                    `[${newPlayer.name}](tg://user?id=${newPlayer.id}), чтобы я смог тебе писать, 
                    тебе надо меня запустить.`,
                    {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{text: 'Запустить', url: 'telegram.me/UltimateWerewolfGameBot?start=start',}]
                            ],
                        }
                    },
                )
            }
        })
}

import TelegramBot from "node-telegram-bot-api";
import {Player} from "../../Player/Player";
import {playerList} from "../playerList";
import {Game} from "../Game";


export const join = (bot: TelegramBot, game: Game, query: TelegramBot.CallbackQuery) => {
    const botName = process.env.BOT_TOKEN!

    const newPlayer = new Player(query.from)
    if ( game.players.map(e => e.id).includes(newPlayer.id)) return;
    game.addPlayer(newPlayer)
    bot.editMessageText(playerList(game), {
        message_id: game.playerCountMsgId,
        chat_id: game.chatId,
        parse_mode: 'Markdown'
    })
    bot.sendMessage(newPlayer.id, 'Ты успешно присоединился к игре!')
        .catch(reason => {
            if (reason.response.statusCode === 403) {
                bot.sendMessage(

                    game.chatId,
                    `[${newPlayer.name}](tg://user?id=${newPlayer.id}), чтобы я смог тебе писать, надо меня запустить.`,
                    {
                        parse_mode: 'Markdown',
                        reply_markup: {
                            inline_keyboard: [
                                [{text: 'Запустить', url: `telegram.me/${process.env.BOT_TOKEN}?start=start`,}]
                            ],
                        }
                    },
                )
            }
        })
}

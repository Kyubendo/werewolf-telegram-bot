import {config} from "dotenv";

config({path: __dirname + '/./../.env'})

import TelegramBot from "node-telegram-bot-api";
import {Game} from "./Game/Game";
import {initGame} from "./Game/commands/init";
import {callbackHandle} from "./Game/commands/callbackHandle";
import {forceStart} from "./Game/commands/forceStart";
import {nextStage} from "./Game/commands/nextStage";
import {TgBot} from "./TgBot";
//optimize imports

const botToken = process.env.BOT_TOKEN!
const herokuUrl = process.env.HEROKU_URL!

// const sendMessage = TelegramBot.prototype.sendMessage
// TelegramBot.prototype.sendMessage = function (chatId: TelegramBot.ChatId, text: string, options?: TelegramBot.SendMessageOptions): Promise<TelegramBot.Message> {
//
//     return TelegramBot.prototype.sendMessage(chatId, text, {parse_mode: 'Markdown', ...options})
// }
//
//
// const editMessageText = TelegramBot.prototype.editMessageText
// TelegramBot.prototype.editMessageText = (text: string, options?: TelegramBot.EditMessageTextOptions): Promise<TelegramBot.Message | boolean> => {
//     return editMessageText(text, {parse_mode: "Markdown", ...options})
// }


let bot: TgBot

if (process.env.NODE_ENV === 'production') {
    bot = new TgBot(botToken);
    bot.setWebHook(herokuUrl + botToken);

    // bot.getUpdates({ limit:0})
} else {
    bot = new TgBot(botToken, {polling: true});
}

export type State = { game?: Game, } // fix maybe
let state: State = {}

initGame(bot, state)

callbackHandle(bot, state)
forceStart(bot, state)
nextStage(bot, state)
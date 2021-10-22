import {config} from "dotenv";

config({path: __dirname + '/./../.env'})

import TelegramBot from "node-telegram-bot-api";
import {Game} from "./Game/Game";
import {initGame} from "./Game/commands/init";
import {callbackHandle} from "./Game/commands/callbackHandle";
import {forceStart} from "./Game/commands/forceStart";
import {nextStage} from "./Game/commands/nextStage";
//optimize imports

const botToken = process.env.BOT_TOKEN!
const herokuUrl = process.env.HEROKU_URL!

let bot: TelegramBot

if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(botToken);
    bot.setWebHook(herokuUrl + botToken);

    // bot.getUpdates({ limit:0})
} else {
    bot = new TelegramBot(botToken, {polling: true});
}

export type State = { game?: Game, } // fix maybe
let state: State = {}

initGame(bot, state)

callbackHandle(bot, state)
forceStart(bot, state)
nextStage(bot, state)
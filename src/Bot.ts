import {config} from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import {initGame} from "./Game/init";
import {Game} from "./Game/Game";
import {callbackHandle} from "./Game/callback";
import {forceStart} from "./Game/gameStart";

config({path: __dirname + '/./../.env'})
const tgToken = process.env.TG_TOKEN!
const herokuUrl = process.env.HEROKU_URL!

let bot: TelegramBot

if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(tgToken);
    bot.setWebHook(herokuUrl + tgToken);
} else {
    bot = new TelegramBot(tgToken, {polling: true});
}

export type State = { game?: Game, } // fix maybe
let state: State = {}

initGame(bot, state)

callbackHandle(bot, state)
forceStart(bot, state)

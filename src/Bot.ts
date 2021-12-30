import {config} from "dotenv";

config({path: __dirname + '/./../.env'})
import "reflect-metadata";
import TelegramBot from "node-telegram-bot-api";
import {Game} from "./Game";
import {initGame} from "./Game/commands/init";
import {callbackHandle} from "./Game/commands/callbackHandle";
import {forceStart} from "./Game/commands/forceStart";
import {nextStage} from "./Game/commands/nextStage";
import {TgBot} from "./TgBot";
import express from "express";
import * as bodyParser from "body-parser";
import {hardReset} from "./Game/commands/hardReset";
import {pinPlayers} from "./Game/commands/pinPlayers";
import {deleteGroupchat} from "./Game/commands/deleteGroupchat";
import {BaseEntity} from "typeorm";
import {connect} from "./Database/connect";

const botToken = process.env.BOT_TOKEN!
const herokuUrl = process.env.HEROKU_URL!

let bot: TelegramBot

if (process.env.NODE_ENV === 'production') {
    bot = new TgBot(botToken);
    bot.setWebHook(herokuUrl + botToken);
} else {
    bot = new TgBot(botToken, {polling: true});
}

export type State = { game?: Game, }


connect().then(connection => {
    BaseEntity.useConnection(connection)
    let state: State = {}

    initGame(bot, state)

    callbackHandle(bot, state)
    forceStart(bot, state)
    nextStage(bot, state)
    hardReset(bot, state)
    pinPlayers(bot, state)
    deleteGroupchat(bot, state)
})


const app = express();
app.use(bodyParser.json());
app.listen(process.env.PORT);
app.post('/' + botToken, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.get('/', (req, res) => res.send('im a heroku kludge'))
import {config} from "dotenv";

config({path: __dirname + '/./../.env'})
import {Player} from "./Player/Player";
import {Game} from "./Game";
import TelegramBot from "node-telegram-bot-api";
import {RoleBase} from "./Roles/Abstract/RoleBase";
import {assignRoles} from "./Game/roleAssign";

const bot = new TelegramBot(process.env.BOT_TOKEN!, {polling: true});


for (let i = 0; i < 10; i++) {
    const players = [...Array(6)].map((_, i) => new Player({id: 0, first_name: 'p' + i, is_bot: false,}))

    const game = new Game('classic', bot, players, 0, () => false, 1)
    RoleBase.game = game

    assignRoles(game)
    console.log(game.players.map(p => p.role?.roleName))
}

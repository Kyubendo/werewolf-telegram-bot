import {config} from "dotenv";

config({path: __dirname + '/./../.env'})
import {Game} from "./Game";
import TelegramBot from "node-telegram-bot-api";
import {assignRoles} from "./Game/roleAssign";
import {Player} from "./Game";
import {Arsonist, RoleBase} from "./Roles";
import {connect} from "./Database/connect";

const bot = new TelegramBot(process.env.BOT_TOKEN!, {polling: true});

connect().then(async () => {
    for (let i = 0; i < 100; i++) {
        const players = [...Array(7)].map((_, i) => new Player({id: 0, first_name: 'p' + i, is_bot: false,}))

        const game = new Game('classic', bot, players, 3141, () => false, 1)
        RoleBase.game = game

        try {
            await assignRoles(game)
        } catch (e) {
            console.log("ERROR\n", game.players.map(p => p.role?.roleName))
        }
        if (game.players.find(p => p.role instanceof Arsonist))
            console.log(game.players.map(p => p.role?.roleName))
    }
})
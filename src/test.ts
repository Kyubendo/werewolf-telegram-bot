import {config} from "dotenv";

config({path: __dirname + '/./../.env'})
import {Game} from "./Game";
import TelegramBot from "node-telegram-bot-api";
import {assignRoles} from "./Game/roleAssign";
import {Player} from "./Game";
import {ApprenticeSeer, Arsonist, Prowler, RoleBase, Seer} from "./Roles";
import {connect} from "./Database/connect";

const bot = new TelegramBot(process.env.BOT_TOKEN!, {polling: true});

connect().then(async () => {
    // let counter = 0;
    // for (let i = 0; i < 1000; i++) {
    //     const players = [...Array(10)].map((_, i) => new Player({id: 0, first_name: 'p' + i, is_bot: false,}))
    //
    //     const game = new Game('classic', bot, players, 3141, () => false, 1)
    //     RoleBase.game = game
    //     try {
    //         await assignRoles(game)
    //     } catch (e) {
    //         console.log("ERROR\n", game.players.map(p => p.role?.roleName))
    //     }
    //     if (game.players.find(p => p.role instanceof ApprenticeSeer)) {
    //         console.log(game.players.map(p => p.role?.roleName))
    //         counter++
    //     }
    // }
    // console.log("\nEND\nTimes dropped: ", counter)
    for (let i = 0; i < 100; i++)
        console.log(Math.random()*60_000);
})

import {config} from "dotenv";

config({path: __dirname + '/./../.env'})
// import {Game} from "./Game";
// import TelegramBot from "node-telegram-bot-api";
// import {assignRoles} from "./Game/roleAssign";
// import {Player} from "./Game";
// import {RoleBase} from "./Roles";
//
// const bot = new TelegramBot(process.env.BOT_TOKEN!, {polling: true});
//
// for (let i = 0; i < 10; i++) {
//     const players = [...Array(6)].map((_, i) => new Player({id: 0, first_name: 'p' + i, is_bot: false,}))
//
//     const game = new Game('classic', bot, players, 0, () => false, 1)
//     RoleBase.game = game
//
//     assignRoles(game)
//     console.log(game.players.map(p => p.role?.roleName))
// }

import "reflect-metadata";
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import {Wolf} from "./Roles";

createConnection().then(async connection => {
    const user = new User();
    user.name = "test";
    user.username = "@test";
    user.rating = 1200;
    await connection.manager.save(user);
    const users = await connection.manager.find(User);
    console.log(users);
}).catch(error => console.log(error));

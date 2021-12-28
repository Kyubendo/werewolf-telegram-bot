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
import {getConnectionOptions, ConnectionOptions} from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const getOptions = async () => {
    let connectionOptions: ConnectionOptions;
    connectionOptions = {
        type: 'postgres',
        synchronize: true,
        logging: false,
        extra: {
            ssl: true,
        },
        entities: ["src/entity/**/*.ts"],
    };
    if (process.env.DATABASE_URL) {
        Object.assign(connectionOptions, {url: process.env.DATABASE_URL});
    } else {
        connectionOptions = await getConnectionOptions();
    }
    return connectionOptions;
};



(async () => {
    const connection = createConnection(await getOptions()).then(async connection => {
        const user = new User();
        user.name = "test";
        user.username = "@test";
        user.rating = 1200;
        await connection.manager.save(user);
        const users = await connection.manager.find(User);
        console.log(users);
    }).catch(error => console.log(error));
})()



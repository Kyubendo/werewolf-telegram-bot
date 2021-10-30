import {config} from "dotenv";

config({path: __dirname + '/./../.env'})
import {Player} from "./Player/Player";
import {Game} from "./Game/Game";
import TelegramBot from "node-telegram-bot-api";
import {RoleBase} from "./Roles/Abstract/RoleBase";
import {Fool, Lycan, SerialKiller, Villager, Wolf} from "./Roles";
import {checkEndGame} from "./Game/checkEndGame";

const bot = new TelegramBot(process.env.BOT_TOKEN!, {polling: true});

const rolePool = [Villager, Villager, SerialKiller, SerialKiller,Wolf, Lycan,Fool]
const players = [...Array(rolePool.length)].map((_, i) => new Player({id: 0, first_name: 'p' + i, is_bot: false,}))

const game = new Game('classic', bot, players, 0, 0)
RoleBase.game = game
game.players.map((player, i) => player.role = new rolePool[i](player))



//
// const sk = game.players.find(p => p.role instanceof SerialKiller)
// if (sk) sk.isAlive = false
//
// const wolf = game.players.find(p => p.role instanceof Wolf)
// if (wolf) wolf.isAlive = false



// console.log(checkEndGame(game.players).map(p => p.name))
console.log(checkEndGame(game.players))

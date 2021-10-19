import * as Roles from "../Roles";
import {arrayShuffle} from "../Utils/arrayShuffle";
import TelegramBot from "node-telegram-bot-api";
import {Game} from "./Game";

export const assignRoles = (bot: TelegramBot, game: Game) => {
    const players = game.players
    const rolePool = [
        Roles.Villager, Roles.Seer,
        Roles.Wolf,
        Roles.Suicide,
    ]
    for (let i = rolePool.length; i < players.length; i++) rolePool.push(Roles.Villager)
    arrayShuffle(rolePool)

    players.forEach((player, i) => {
        const role = new rolePool[i](bot, game)
        player.role = role
        bot.sendMessage(player.id, role.startMessageText)
    })

}
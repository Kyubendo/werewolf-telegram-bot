import * as Roles from "../Roles";
import {arrayShuffle} from "../Utils/arrayShuffle";
import TelegramBot from "node-telegram-bot-api";
import {Player} from "../Player/Player";

export const assignRoles = (bot: TelegramBot, players: Player[]) => {
    const rolePool = [
        Roles.Villager, Roles.Seer,
        Roles.Wolf,
        Roles.Suicide,
    ]
    for (let i = rolePool.length; i < players.length; i++) rolePool.push(Roles.Villager)
    arrayShuffle(rolePool)

    players.forEach((player, i) => {
        const role = new rolePool[i]
        player.role = role
        bot.sendMessage(player.id, role.startMessageText)
    })

}
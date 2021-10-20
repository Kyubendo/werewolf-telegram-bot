import * as Roles from "../Roles";
import {arrayShuffle} from "../Utils/arrayShuffle";
import TelegramBot from "node-telegram-bot-api";
import {Game} from "./Game";
import {RoleBase} from "../Roles/RoleBase";

export const assignRoles = (bot: TelegramBot, game: Game) => {
    RoleBase.bot = bot;
    RoleBase.game = game;
    const players = game.players
    const rolePool = [
        Roles.Lycan, Roles.Seer,
        Roles.Villager, Roles.Seer, Roles.Fool, Roles.ClumsyGuy, Roles.Cursed,
        Roles.Wolf, Roles.Lycan,
        Roles.Suicide,
    ]
    for (let i = rolePool.length; i < players.length; i++) rolePool.push(Roles.Villager)
    // arrayShuffle(rolePool) // add

    players.forEach((player, i) => {
        const role = new rolePool[i](player)
        player.role = role
        bot.sendMessage(player.id, role.startMessageText + '\nВес роли:' + role.weight)
    })

 }
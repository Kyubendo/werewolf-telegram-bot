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

        Roles.Villager, Roles.Seer, Roles.Fool, Roles.ClumsyGuy, Roles.Cursed, Roles.Traitor, Roles.WoodMan,
        Roles.Wolf, Roles.Lycan,
        Roles.Suicide,
    ]
    for (let i = rolePool.length; i < players.length; i++) rolePool.push(Roles.Villager)

    let balanced = false
    do {
        // arrayShuffle(rolePool) // add
        balanced = Math.abs(
            players.map((player, i) => player.role = new rolePool[i](player)).reduce((a, c) => a + c.weight(), 0)
        ) < 123 // change 123 to variance

    } while (!balanced)

    players.forEach(player => player.role && bot.sendMessage(player.id, player.role.startMessageText))
}
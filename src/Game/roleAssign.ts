import * as Roles from "../Roles";
import {Game} from "./Game";
import {RoleBase} from "../Roles/Abstract/RoleBase";

export const assignRoles = (game: Game) => {
    RoleBase.game = game;
    const players = game.players
    const rolePool = [
        Roles.SerialKiller,Roles.Villager,Roles.Oracle, Roles.WiseElder, Roles.GuardianAngel,

        Roles.Villager, Roles.ClumsyGuy, Roles.Cursed, Roles.Traitor, Roles.WoodMan, Roles.Mason,
        Roles.Beholder, // Passive Villagers
        Roles.Seer, Roles.Fool, Roles.Monarch, Roles.Harlot, Roles.Oracle, Roles.Gunner, Roles.GuardianAngel,
        Roles.WiseElder, // Active Villagers
        Roles.Wolf, Roles.Lycan, // Wolves and their allies
        Roles.Suicide, Roles.SerialKiller, Roles.Thief // Other
    ]
    for (let i = rolePool.length; i < players.length; i++) rolePool.push(Roles.Villager)

    let balanced = false
    do {
        // arrayShuffle(rolePool) // add
        balanced = Math.abs(
            players.map((player, i) => player.role = new rolePool[i](player))
                .reduce((a, c) => a + c.weight(), 0)
        ) < 123 // change 123 to variance

    } while (!balanced)

    players.forEach(player => player.role && game.bot.sendMessage(
        player.id,
        player.role.startMessageText()));
}
import * as Roles from "../Roles";
import {Game} from "./Game";
import {RoleBase} from "../Roles/RoleBase";

export const assignRoles = (game: Game) => {
    RoleBase.game = game;
    const players = game.players
    const rolePool = [
        Roles.Villager, Roles.Villager, Roles.Villager, Roles.Villager, Roles.Villager,
        Roles.Wolf, Roles.Monarch, Roles.Thief, Roles.SerialKiller, Roles.Lycan, Roles.Cursed, Roles.Seer,

        Roles.Villager, Roles.ClumsyGuy, Roles.Cursed, Roles.Traitor, Roles.WoodMan, Roles.Mason,
        Roles.Beholder, // Passive Villagers
        Roles.Seer, Roles.Fool, Roles.Monarch, Roles.Harlot, // Active Villagers
        Roles.Wolf, Roles.Lycan, // Wolves
        Roles.Suicide, Roles.SerialKiller, Roles.Thief // Other
    ]
    for (let i = rolePool.length; i < players.length; i++) rolePool.push(Roles.Villager)

    let balanced = false
    do {
        // arrayShuffle(rolePool) // add
        balanced = Math.abs(
            players.map((player, i) => player.role = new rolePool[i](player)).reduce((a, c) => a + c.weight(), 0)
        ) < 123 // change 123 to variance

    } while (!balanced)

    players.forEach(player => player.role && game.bot.sendMessage(player.id, player.role.startMessageText))
}
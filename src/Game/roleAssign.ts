import * as Roles from "../Roles";
import {Game} from "./Game";
import {RoleBase} from "../Roles/Abstract/RoleBase";

export const assignRoles = (game: Game) => {
    RoleBase.game = game;
    const players = game.players
    const rolePool = [

        Roles.Monarch,Roles.Martyr, Roles.Villager, Roles.SerialKiller, Roles.GuardianAngel, Roles.Villager,

        Roles.Villager, Roles.ClumsyGuy, Roles.Cursed, Roles.Traitor, Roles.WoodMan, Roles.Mason,
        Roles.Beholder, // Passive Villagers
        Roles.Seer, Roles.Fool, Roles.Monarch, Roles.Harlot, Roles.Oracle, Roles.Gunner, Roles.GuardianAngel,

        Roles.WiseElder,  Roles.Blacksmith, // Active Villagers
      
        Roles.Wolf, Roles.Lycan, Roles.Sorcerer, Roles.AlphaWolf,// WolfTeam

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
        player.role.roleIntroductionText() + player.role.startMessageText())
    );
}
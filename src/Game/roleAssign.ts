import {Game} from "./Game";
import {RoleBase} from "../Roles/Abstract/RoleBase";
import {arrayShuffle} from "../Utils/arrayShuffle";
import {
    AlphaWolf, ApprenticeSeer, Beauty,
    Beholder, Blacksmith,
    ClumsyGuy,
    Cursed, Detective, Doppelganger, Drunk, Fool, GuardianAngel, Gunner, Harlot, JackOLantern, Lycan, Martyr, FallenAngel,
    Mason, Monarch, Necromancer, Oracle, Sandman, Seer,
    SerialKiller,
    Sorcerer, Suicide, Thief,
    Traitor,
    Villager, WildChild, WiseElder, Wolf,
    WoodMan
} from "../Roles";

export const assignRoles = (game: Game) => {
    RoleBase.game = game;
    const players = game.players
    const killersPool = [
        Wolf, Lycan, SerialKiller, AlphaWolf, JackOLantern,
    ]
    const wolfNeededRoles = [Sorcerer, Traitor]
    const evilPool = [...killersPool, Sorcerer]
    const villagersPool = [
        Villager,
        //ClumsyGuy,
        Cursed, WoodMan, Mason, Beauty, Drunk, Beholder, // Passive Villagers
        Seer, Monarch, Fool, Harlot, Oracle, Gunner, GuardianAngel,
        WiseElder, Sandman, Blacksmith, WildChild, Detective, Martyr,// Active Villagers

        Suicide, Thief, Necromancer, Doppelganger// Other
    ]

    const testPool = [Thief, Wolf, Beauty,
        FallenAngel, Wolf, WildChild, Villager,
        Oracle, Villager, GuardianAngel, Villager, Wolf, Cursed, WoodMan, Mason,
        Harlot,
        Beholder, // Passive Villagers

        Seer, Monarch, Fool, Harlot, Oracle, Gunner, GuardianAngel,
        WiseElder, Sandman, Blacksmith, WildChild, // Active Villagers

        Suicide, Thief, Necromancer, // Other
    ]

    let balanced = false
    do {
        const availableKillers = [...killersPool]
        arrayShuffle(availableKillers)

        let rolePool = [...villagersPool]
        const evilCount = Math.floor((players.length - 4) / 2) + +(Math.random() >= .5)
        const evils = [...Array(evilCount)].map(() => availableKillers.pop())
        evils.find(e => e instanceof Wolf) && rolePool.push(...wolfNeededRoles)

        arrayShuffle(rolePool)

        if ([...rolePool].slice(0, players.length - evilCount).find(e => e === Mason)) {
            for (let i = 0; i < players.length / 3 - 1; i++) Math.random() >= .5 && rolePool.unshift(Mason)
        }
        if ([...rolePool].slice(0, players.length - evilCount - 1).find(e => e === Seer)) rolePool.unshift(ApprenticeSeer)

        evils.forEach(e => e && rolePool.unshift(e))

        rolePool = rolePool.slice(0, players.length)
        arrayShuffle(rolePool)

        const currentRoles = players.map((player, i) => player.role = new rolePool[i](player))
        const weight = Math.abs(currentRoles.reduce((a, c) => a + c.weight(), 0))
        const currentEvilCount = currentRoles.filter(r => evilPool.find(e => r instanceof e)).length

        balanced = currentEvilCount <= players.length / 2 - 1
            && weight <= players.length / 3

    } while (!balanced)

    const currentRoles = players.map((player, i) => player.role = new testPool[i](player))

    players.forEach(player => player.role && game.bot.sendMessage(
        player.id,
        player.role.roleIntroductionText() + player.role.startMessageText())
    );
}
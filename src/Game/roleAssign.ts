import {Game} from "./Game";
import {arrayShuffle} from "../Utils/arrayShuffle";
import {
    AlphaWolf, ApprenticeSeer, Beauty,
    Beholder, Blacksmith,
    ClumsyGuy, Cupid,
    Cursed, Detective, Doppelganger, Drunk, Fool, GuardianAngel, Gunner, Harlot, Lycan, Martyr,
    Mason, Monarch, Mayor, Necromancer, Oracle, Princess, RoleBase, Sandman, Seer, Prowler,
    SerialKiller,
    Sorcerer, Suicide, Thief,
    Traitor,
    Villager, WildChild, WiseElder, Wolf,
    WoodMan, Arsonist
    // JackOLantern
} from "../Roles";

export const assignRoles = async (game: Game) => {
    RoleBase.game = game;
    const players = game.players
    const wolves = [Wolf, Lycan, AlphaWolf,]
    const killersPool = [
        ...wolves, SerialKiller, Arsonist,
        //JackOLantern,
    ]
    const wolfNeededRoles = [Sorcerer, Traitor, Prowler]
    const evilPool = [...killersPool, Sorcerer, Prowler]
    const villagersPool = [
        Villager,
        ClumsyGuy, Cursed, WoodMan, Mason, Beauty, Drunk, Beholder, Princess, // Passive Villagers
        Seer, Monarch, Mayor, Fool, Harlot, Oracle, Gunner, GuardianAngel, Cupid,
        WiseElder, Sandman, Blacksmith, WildChild, Detective, Martyr,// Active Villagers

        Suicide, Thief, Necromancer, Doppelganger// Other
    ]


    const testPool = [
        Prowler, Wolf, Villager,
        Villager, Villager, Villager, Villager, Villager, Villager, Villager, Villager,
    ]

    if (!process.env.ROLE_TEST) {
        let balanced = false
        do {
            const availableKillers = [...killersPool]
            arrayShuffle(availableKillers)

            let rolePool = [...villagersPool]
            const evilCount = Math.floor((players.length - 4) / 2) + +(Math.random() >= .5)
            const evils = [...Array(evilCount)].map(() => availableKillers.pop())
            evils.find(e => wolves.find(w => w === e)) && rolePool.push(...wolfNeededRoles)

            arrayShuffle(rolePool)

            if ([...rolePool].slice(0, players.length - evilCount - 1).find(e => e === Mason)) {
                for (let i = 0; i < players.length / 3 - 1; i++) Math.random() >= .5 && rolePool.unshift(Mason)
            }
            if ([...rolePool].slice(0, players.length - evilCount - 1).find(e => e === Seer)
                && Math.random() < 1 / villagersPool.length
            ) rolePool.unshift(ApprenticeSeer)

            evils.forEach(e => e && rolePool.unshift(e))

            rolePool = rolePool.slice(0, players.length)
            arrayShuffle(rolePool)

            const currentRoles = players.map((player, i) => player.role = new rolePool[i](player))
            const weight = Math.abs(currentRoles.reduce((a, c) => a + c.weight(), 0))
            const currentEvilCount = currentRoles.filter(r => evilPool.find(e => r instanceof e)).length

            balanced = currentEvilCount <= players.length / 2 - 1
                && weight <= players.length / 3

        } while (!balanced)
    } else players.map((player, i) => player.role = new testPool[i](player))

    for (const player of players) {
        player.role && await game.bot.sendMessage(
            player.id,
            player.role.roleIntroductionText() + ' ' + player.role.startMessageText()
        );
    }
}
import {arrayShuffle} from "../Utils/arrayShuffle";
import {
    AlphaWolf, ApprenticeSeer, Beauty,
    Beholder, Blacksmith,
    ClumsyGuy, Cupid,
    Cursed, Detective, Doppelganger, Drunk, Fool, GuardianAngel, Gunner, Harlot, Lycan, Martyr,
    Mason, Monarch, Mayor, Undertaker, Oracle, Princess, RoleBase, Sandman, Seer, Prowler,
    SerialKiller, PuppetMaster,
    Sorcerer, Suicide, Thief,
    Traitor,
    Villager, WildChild, WiseElder, Wolf,
    WoodMan, Pacifist, Arsonist, Cowboy, RoleWeights
    // JackOLantern
} from "../Roles";
import {Game} from "./Game";
import {Role} from "../entity/Role";

export const assignRoles = async (game: Game) => {
    RoleBase.game = game;
    const players = game.players

    const roleWeights: { [name: string]: RoleWeights } = {}
    const rolesData = await Role.find()
    rolesData.forEach(r => roleWeights[r.name] = {
        baseWeight: r.baseWeight,
        conditionWeight: r.conditionWeight,
        conditionWeight2: r.conditionWeight2,
        weightCoefficient: r.weightCoefficient,
    })
    const wolves = [Wolf, Lycan, AlphaWolf,]
    const killersPool = [
        ...wolves, SerialKiller
        //JackOLantern,
    ]
    const killerNeededRoles = [PuppetMaster, Arsonist]
    const wolfNeededRoles = [Sorcerer, Traitor, Prowler]
    const evilPool = [...killersPool, ...killerNeededRoles, Sorcerer, Prowler]
    const villagersPool = [
        Villager,
        ClumsyGuy, Cursed, WoodMan, Mason, Beauty, Drunk, Beholder, Princess, Cowboy,// Passive Villagers

        Seer, Monarch, Mayor, Fool, Harlot, Oracle, Gunner, GuardianAngel, Cupid, Pacifist,
        WiseElder, Sandman, Blacksmith, WildChild, Detective, Martyr,// Active Villagers

        Suicide, Thief, Undertaker, Doppelganger// Other
    ]

    const testPool = [
        Villager,
        Villager, Villager, Villager, Villager, Villager, Villager, Villager, Villager,
    ]

    if (!process.env.ROLE_TEST) {
        let balanced = false
        do {
            const availableKillers = [...killersPool]
            arrayShuffle(availableKillers)

            let rolePool = [...villagersPool, ...killerNeededRoles]
            let killerCount = Math.floor((players.length - 1) / 4)
            if (players.length > 6 && Math.random() >= .5) ++killerCount

            const evils = [...Array(killerCount)].map(() => availableKillers.pop())
            evils.find(e => wolves.find(w => w === e)) && rolePool.push(...wolfNeededRoles)

            arrayShuffle(rolePool)

            if ([...rolePool].slice(0, players.length - killerCount - 1).find(e => e === Mason)) {
                for (let i = 0; i < players.length / 3 - 1; i++) Math.random() >= .5 && rolePool.unshift(Mason)
            }
            if ([...rolePool].slice(0, players.length - killerCount - 1).find(e => e === Seer)
                && Math.random() < (1 / villagersPool.length) * 8) rolePool.unshift(ApprenticeSeer)

            evils.forEach(e => e && rolePool.unshift(e))

            rolePool = rolePool.slice(0, players.length)
            arrayShuffle(rolePool)

            const currentRoles = players.map((player, i) => player.role = new rolePool[i](player))
            const weight = currentRoles.reduce((acc, curRole: RoleBase) => {
                const weight = curRole.weight(roleWeights[curRole.constructor.name]);
                if (weight === null) {
                    throw `roleAssign 87, ${curRole.constructor.name}`;
                }
                return acc + weight
            }, 0)
            const currentEvilCount = currentRoles.filter(r => evilPool.find(e => r instanceof e)).length

            balanced = currentEvilCount <= players.length / 2 - 1
                && Math.abs(weight) <= players.length / 4.5

        } while (!balanced)
    } else players.map((player, i) => player.role = new testPool[i](player))

    for (const player of players) {
        player.role?.weight(roleWeights[player.role.constructor.name])
        player.role && await game.bot.sendMessage(
            player.id,
            player.role.roleIntroductionText() + ' ' + player.role.startMessageText()
        );

        await player.role?.sendAlliesMessage?.();
    }
}

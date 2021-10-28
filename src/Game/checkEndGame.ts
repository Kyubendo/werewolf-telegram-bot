import {Player} from "../Player/Player";
import {
    ApprenticeSeer,
    Beholder,
    ClumsyGuy,
    Cursed,
    Drunk,
    Fool,
    GuardianAngel,
    Gunner,
    Harlot,
    Mason,
    Monarch, Oracle, Seer, SerialKiller, Traitor, Villager, WiseElder, Wolf, WoodMan
} from "../Roles";
import {GameStage} from "./Game";

const villagers: Function[] = [
    ApprenticeSeer, Beholder, ClumsyGuy, Cursed, Drunk, GuardianAngel, Gunner, Harlot, Mason, Monarch, Oracle, Seer,
    Traitor, Villager, WiseElder, WoodMan
]
const wolfTeam: Function[] = [Wolf,]
const evil: Function[] = [Wolf, SerialKiller]
const nonWolfKillers: Function[] = [SerialKiller]


export const checkEndGame = (players: Player[], stage: GameStage): undefined | Player[] => {
    const alivePlayers = players.filter(p => p.isAlive)

    if (!alivePlayers.find(p => evil.find(e => p.role instanceof e))) {
        return players.filter(p => villagers.find(v => p.role instanceof v))
    }

    const aliveWolves = alivePlayers.filter(p => p.role instanceof Wolf)

    alivePlayers.find(p => p.role instanceof Gunner && p.role.ammo) && nonWolfKillers.push(Gunner)
    const aliveUniqueKillers = [...new Set(alivePlayers
        .filter(p => nonWolfKillers.find(k => p.role instanceof k))
        .map(p => p.role!.constructor))]
    aliveWolves.length && aliveUniqueKillers.push(Wolf)

    if (aliveUniqueKillers.length > 1) {
        if (alivePlayers.length > 2) return undefined
        else {
            const wolf = players.find(p => p.role instanceof Wolf)
            const serialKiller = players.find(p => p.role instanceof SerialKiller)
            const gunner = players.find(p => p.role instanceof Gunner)
            // const cowboy = players.filter(p => p.role instanceof Cowboy)
            // const puppetMaster = players.filter(p => p.role instanceof PuppetMaster)

            // if(puppetMaster) return puppetMaster
            if (wolf && serialKiller) return [serialKiller]
            if ((wolf || serialKiller) && gunner) {
                if (stage === 'night') return players.filter(p => villagers.find(v => p.role instanceof v))
                return [wolf ?? serialKiller!]
            }
            // if(cowboy && serialKiller) return []
            // if(cowboy && wolf) return [Math.random()>.3 wolf:cowboy]
        }
    }

    if (aliveWolves.length * 2 >= alivePlayers.length) {
        return players.filter(p => p.role instanceof Wolf)
    }

    if (alivePlayers.length < 3) {
        const evilPlayer = players.find(p => evil.find(e => p.role instanceof e))
        return evilPlayer ? [evilPlayer] : undefined
    }

    return undefined
}


const setWinners = (players: Player[]) => {

}
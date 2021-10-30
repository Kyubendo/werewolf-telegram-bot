import {Player} from "../Player/Player";
import {
    ApprenticeSeer,
    Beholder,
    ClumsyGuy,
    Cursed,
    Drunk,
    GuardianAngel,
    Gunner,
    Harlot, Martyr,
    Mason,
    Monarch, Oracle, Seer, SerialKiller, Traitor, Villager, WiseElder, Wolf, WoodMan
} from "../Roles";
import {GameStage} from "./Game";

const villagers: Function[] = [
    ApprenticeSeer, Beholder, ClumsyGuy, Cursed, Drunk, GuardianAngel, Gunner, Harlot, Mason, Monarch, Oracle, Seer,
    Traitor, Villager, WiseElder, WoodMan, Martyr
]
const wolfTeam: Function[] = [Wolf,]
const evil: Function[] = [Wolf, SerialKiller]
const nonWolfKillers: Function[] = [SerialKiller]

export type Win = 'villagers' | 'serialKiller' | 'wolves' | 'suicide' | 'nobody'
export const checkEndGame = (players: Player[], stage: GameStage): undefined | { winners: Player[], type: Win } => {
    const wolvesTeamPlayers = players.filter(p => wolfTeam.find(wa => p.role instanceof wa))
    const villagersTeamPlayers = players.filter(p => villagers.find(v => p.role instanceof v))
    const alivePlayers = players.filter(p => p.isAlive)
    const aliveWolves = alivePlayers.filter(p => p.role instanceof Wolf)
    const aliveEvilPlayer = alivePlayers.find(p => evil.find(e => p.role instanceof e))
    if (!aliveEvilPlayer) {
        return {winners: villagersTeamPlayers, type: 'villagers'}
    }

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
            if (wolf && serialKiller) return {winners: [serialKiller], type: 'serialKiller'}
            if ((wolf || serialKiller) && gunner) {
                if (stage === 'night') return {winners: villagersTeamPlayers, type: 'villagers'}
                return wolf
                    ? {winners: wolvesTeamPlayers, type: 'wolves'}
                    : {winners: [serialKiller!], type: 'serialKiller'}
            }
            // if(cowboy && serialKiller) return []
            // if(cowboy && wolf) return [Math.random()>.3 wolf:cowboy]
        }
    }

    if (aliveWolves.length * 2 >= alivePlayers.length) {
        return {winners: wolvesTeamPlayers, type: 'wolves'}
    }

    if (alivePlayers.length < 3) {
        if (aliveEvilPlayer.role instanceof SerialKiller) return {winners: [aliveEvilPlayer], type: 'serialKiller'}
    }

    return undefined
}


export const setWinners = (winners: Player[], players: Player[]) => {
    winners.forEach(w => w.won = true)
    const sacrificedMartyrs = players.map(p => p.role).filter(r => (r instanceof Martyr) && r.diedForTarget)
    for (const sm of sacrificedMartyrs) if (sm) sm.player.won = !!sm.targetPlayer && !!~winners.indexOf(sm.targetPlayer)
}
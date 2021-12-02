import {Player} from "../Game";
import {
    ApprenticeSeer, Beholder, Blacksmith, ClumsyGuy, Cursed, Drunk, GuardianAngel, Gunner, Harlot, Martyr, Mason,
    Monarch, Oracle, Sandman, Seer, SerialKiller, Traitor, Villager, WiseElder, Wolf, WoodMan, WildChild, Beauty,
    JackOLantern, Pumpkin, Detective, Cupid, Princess, Mayor, Sorcerer, Prowler, Arsonist, Pacifist, Cowboy,
    FallenAngel,
} from "../Roles";
import {GameStage} from "./Game";

const villagers: Function[] = [
    ApprenticeSeer, Beholder, ClumsyGuy, Cursed, Drunk, GuardianAngel, Gunner, Harlot, Mason, Mayor, Monarch, Oracle,
    Seer, Traitor, Villager, WiseElder, WoodMan, Martyr, Sandman, Blacksmith, WildChild, Beauty, Detective, Cupid,
    Princess, Pacifist, Cowboy
]
const wolfTeam: Function[] = [Wolf, FallenAngel, Sorcerer, Prowler]
const nonWolfKillers: Function[] = [SerialKiller, FallenAngel, Arsonist, JackOLantern, Cowboy]
const evil: Function[] = [Wolf, ...nonWolfKillers]

export type Win = 'villagers' | 'serialKiller' | 'wolves' | 'lovers' | 'suicide' | 'nobody' | 'jack' | 'arsonist'
export const checkEndGame = (players: Player[], stage: GameStage): undefined | { winners: Player[], type: Win } => {
    const wolvesTeamPlayers = players.filter(p => wolfTeam.find(wa => p.role instanceof wa))
    const villagersTeamPlayers = players.filter(p => villagers.find(v => p.role instanceof v))
    const alivePlayers = players.filter(p => p.isAlive)
    const aliveWolves = alivePlayers.filter(p => p.role instanceof Wolf)
    const aliveWolfKillers = alivePlayers.filter(p => (p.role instanceof Wolf) || (p.role instanceof FallenAngel))
    const aliveEvilPlayer = alivePlayers.find(p => evil.find(e => p.role instanceof e))
    const aliveJackPlayers = alivePlayers.filter(player => player.role instanceof JackOLantern);

    if (alivePlayers.length === 2 && alivePlayers[0].lover === alivePlayers[1]) {
        return {winners: alivePlayers.filter(player => player.lover), type: 'lovers'}
    }

    if (aliveJackPlayers.length
        && !alivePlayers.filter(p => !(p.role instanceof Pumpkin) && !(p.role instanceof JackOLantern)).length) {
        return {winners: players.filter(player => player.role instanceof JackOLantern), type: 'jack'}
    }

    if (!aliveEvilPlayer) {
        if (villagersTeamPlayers.find(p => p.isAlive)) return {winners: villagersTeamPlayers, type: 'villagers'}
        else return {winners: [], type: 'nobody'}
    }

    alivePlayers.find(p => p.role instanceof Gunner && p.role.specialCondition.ammo) && nonWolfKillers.push(Gunner)
    const aliveUniqueKillers = [...new Set(alivePlayers
        .filter(p => nonWolfKillers.find(k => p.role instanceof k))
        .map(p => p.role!.constructor))]
    aliveWolves.length && aliveUniqueKillers.push(Wolf)

    if (aliveUniqueKillers.length > 1) {
        if (alivePlayers.length > 2) return undefined
        else {
            if (aliveJackPlayers.length) return undefined;

            const wolf = players.find(p => p.role instanceof Wolf)
            const fallenAngel = players.find(p => p.role instanceof FallenAngel)
            const serialKiller = players.find(p => p.role instanceof SerialKiller)
            const gunner = players.find(p => p.role instanceof Gunner)
            const arsonist = players.find(p => p.role instanceof Arsonist)
            const cowboy = players.filter(p => p.role instanceof Cowboy)
            // const puppetMaster = players.filter(p => p.role instanceof PuppetMaster)

            // if(puppetMaster) return puppetMaster

            if ((wolf || arsonist || fallenAngel) && serialKiller)
                return {winners: [serialKiller], type: 'serialKiller'}
            if ((wolf || serialKiller || arsonist || fallenAngel) && gunner) {
                if (stage === 'night') {
                    aliveEvilPlayer.isAlive = false
                    return {winners: villagersTeamPlayers, type: 'villagers'} // custom gunner win
                }
                if (wolf || fallenAngel) return {winners: wolvesTeamPlayers, type: 'wolves'}
                if (serialKiller) return {winners: [serialKiller], type: 'serialKiller'}
                if (arsonist) return {winners: [arsonist], type: 'arsonist'}
            }
            if (cowboy) {
                alivePlayers.forEach(p => p.isAlive = false)
                return {winners: [], type: 'nobody'} // custom cowboy lose
            }
            if (arsonist) return undefined;
        }
    }

    if (aliveWolfKillers.length * 2 >= alivePlayers.length) {
        return {winners: wolvesTeamPlayers, type: 'wolves'}
    }

    if (alivePlayers.length < 3) {
        const serialKillers = alivePlayers.filter(p => p.role instanceof SerialKiller)
        if (serialKillers.length) {
            if (serialKillers.length === 2) {
                if (serialKillers.find(p => p.isFrozen)) return undefined
                serialKillers.forEach(p => p.isAlive = false)
                return {winners: [], type: 'nobody'}
            }
            return {winners: [aliveEvilPlayer], type: 'serialKiller'}
        } else if (aliveEvilPlayer.role instanceof Arsonist) return {
            winners: players.filter(p => p.role instanceof Arsonist),
            type: 'arsonist'
        }
    }

    return undefined
}


export const setWinners = (winners: Player[], players: Player[]) => {
    winners.forEach(w => w.won = true)
    const lovers = players.map(player => player.lover);
    for (const lover of lovers) if (lover?.won && lover.lover) lover.lover.won = true;
    const sacrificedMartyrs = players.map(p => p.role).filter(r => (r instanceof Martyr) && r.diedForProtectedPlayer)
    for (const sm of sacrificedMartyrs) {
        if (sm) sm.player.won =
            sm instanceof Martyr
            && !!winners.find(p => p === sm.specialCondition.protectedPlayer)
    }
}
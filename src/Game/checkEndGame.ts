import {Player} from "../Game";
import {
    ApprenticeSeer, Beholder, Blacksmith, ClumsyGuy, Cursed, Drunk, GuardianAngel, Gunner, Harlot, Martyr, Mason,
    Monarch, Oracle, Sandman, Seer, SerialKiller, Traitor, Villager, WiseElder, Wolf, WoodMan, WildChild, Beauty,
    JackOLantern, Pumpkin, Detective, Cupid, Princess, Mayor, Sorcerer, Prowler, Arsonist, Pacifist, Cowboy, Snowman,
} from "../Roles";
import {GameStage} from "./Game";

const villagers: Function[] = [
    ApprenticeSeer, Beholder, ClumsyGuy, Cursed, Drunk, GuardianAngel, Gunner, Harlot, Mason, Mayor, Monarch, Oracle,
    Seer, Traitor, Villager, WiseElder, WoodMan, Martyr, Sandman, Blacksmith, WildChild, Beauty, Detective, Cupid,
    Princess, Pacifist, Cowboy, Snowman,
]

const wolfTeam: Function[] = [Wolf, Sorcerer, Prowler]
const nonWolfEvilKillers = [SerialKiller, Arsonist, JackOLantern]
const goodKillers: Function[] = [Cowboy]
const evil: Function[] = [Wolf, ...nonWolfEvilKillers]

export type Win = 'villagers' | 'serialKiller' | 'wolves' | 'lovers' | 'suicide' | 'nobody' | 'jack' | 'arsonist'
export const checkEndGame = (players: Player[], stage: GameStage): undefined | { winners: Player[], type: Win } => {
    const wolvesTeamPlayers = players.filter(p => wolfTeam.find(wa => p.role instanceof wa))
    const villagersTeamPlayers = players.filter(p => villagers.find(v => p.role instanceof v))
    const alivePlayers = players.filter(p => p.isAlive)
    const aliveWolves = alivePlayers.filter(p => p.role instanceof Wolf)
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
        if (villagersTeamPlayers.find(p => p.isAlive)) return {
            winners: villagersTeamPlayers,
            type: 'villagers'
        }
        else return {winners: [], type: 'nobody'}
    }

    alivePlayers.find(p => p.role instanceof Gunner && p.role.specialCondition.ammo) && goodKillers.push(Gunner)
    const aliveUniqueKillers = [...new Set(alivePlayers
        .filter(p => nonWolfEvilKillers.find(k => p.role instanceof k) || goodKillers.find(k => p.role instanceof k))
        .map(p => p.role!.constructor))]
    aliveWolves.length && aliveUniqueKillers.push(Wolf)

    if (aliveUniqueKillers.length > 1) {
        if (alivePlayers.length <= 2) {
            if (aliveJackPlayers.length) return undefined;

            const wolf = alivePlayers.find(p => p.role instanceof Wolf)
            const serialKiller = alivePlayers.find(p => p.role instanceof SerialKiller)
            const gunner = alivePlayers.find(p => p.role instanceof Gunner)
            const arsonist = alivePlayers.find(p => p.role instanceof Arsonist)
            const cowboy = alivePlayers.find(p => p.role instanceof Cowboy)
            // const puppetMaster = alivePlayers.filter(p => p.role instanceof PuppetMaster)

            // if(puppetMaster) return puppetMaster

            if (wolf && serialKiller) return {winners: [serialKiller], type: 'serialKiller'}
            if ((wolf || serialKiller || arsonist) && gunner) {
                if (stage === 'day') {
                    aliveEvilPlayer.isAlive = false
                    return {winners: villagersTeamPlayers, type: 'villagers'} // custom gunner win
                }
                if (wolf) return {winners: wolvesTeamPlayers, type: 'wolves'}
                if (serialKiller) return {winners: [serialKiller], type: 'serialKiller'}
                if (arsonist) return {winners: players.filter(p => p.role instanceof Arsonist), type: 'arsonist'}
            }
            if (cowboy) {
                alivePlayers.forEach(p => p.isAlive = false)
                return {winners: [], type: 'nobody'} // custom cowboy lose
            }
            if (arsonist) return undefined;
        } else {
            return undefined
        }
    }

    if (aliveWolves.length * 2 >= alivePlayers.length) {
        return {winners: wolvesTeamPlayers, type: 'wolves'}
    }

    if (alivePlayers.length < 3) {
        const serialKillers = alivePlayers.filter(p => p.role instanceof SerialKiller)
        if (serialKillers.length) {
            if (serialKillers.length === 2) {
                if (serialKillers.find(p => p.daysLeftToUnfreeze)) return undefined
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
        if (sm instanceof Martyr) sm.player.won = !!sm.specialCondition.protectedPlayer?.won
    }
}
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

const villagers = [
    ApprenticeSeer, Beholder, ClumsyGuy, Cursed, Drunk, GuardianAngel, Gunner, Harlot, Mason, Monarch, Oracle, Seer,
    Traitor, Villager, WiseElder, WoodMan
]
const wolfTeam = [Wolf,]
const evil = [Wolf, SerialKiller]
const killers = [Wolf, Gunner, SerialKiller]


export const checkEndGame = (players: Player[]): Player[] => {

    if (!players.find(p => p.isAlive && evil.find(e => p.role instanceof e))) {
        return players.filter(p => villagers.find(v => p instanceof v))
    }
    return []

    // players.filter(p => killers.find(k => p instanceof k))
}


const setWinners = (players: Player[]) => {

}
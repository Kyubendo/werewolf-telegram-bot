import {
    Blacksmith,
    Detective,
    GuardianAngel,
    Gunner,
    Harlot,
    Martyr,
    Monarch,
    Oracle,
    Seer,
    SerialKiller, Sorcerer,
    Thief,
    WiseElder,
    Wolf
} from "../Roles";
import {GameStage} from "./Game";

export const roleResolves = (stage: GameStage) => {
    switch (stage) {
        case 'day':
            return dayRoleResolves
        case 'night':
            return nightRoleResolves
        default:
            return []
    }
}

const dayRoleResolves = [
    Martyr, // WildChild, // constant choices
    Monarch,
    Gunner,
    WiseElder, Detective,
    Blacksmith, // last because he can freeze action of infected but still not wolf player
]

const nightRoleResolves = [
    // PuppetMaster,
    // Jack
    Harlot, //Prowler
    Martyr,
    GuardianAngel,
    Thief,
    Wolf,
    SerialKiller,
    Sorcerer, Seer, Oracle,
]
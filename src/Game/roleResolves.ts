import {
    Blacksmith,
    Detective,
    GuardianAngel,
    Gunner,
    Harlot,
    Martyr,
    Monarch,
    Oracle, Sandman,
    Seer,
    SerialKiller, Sorcerer,
    Thief, WildChild,
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
    Martyr, WildChild,  // WildChild, // constant choices
    Monarch,
    Gunner,
    WiseElder, Detective,
    Sandman // prelast because he freeze all other actions including Blacksmith's
    Blacksmith, // last because he can freeze action of infected but still not wolf player
]

const nightRoleResolves = [
    // PuppetMaster,
    // Jack
    Harlot, //Prowler
    Martyr, WildChild, // constant choices
    GuardianAngel,
    Thief,
    Wolf,
    SerialKiller,
    Sorcerer, Seer, Oracle,
]
import {
    Blacksmith,
    Detective, Doppelganger,
    GuardianAngel,
    Gunner,
    Harlot, JackOLantern,
    Martyr,
    Monarch, Necromancer,
    Oracle, Pumpkin, Sandman,
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
        case 'lynch':
            return lynchRoleResolves
        default:
            return []
    }
}

const dayRoleResolves = [
    Martyr, WildChild, Doppelganger, WildChild, // constant choices
    Monarch,
    Gunner,
    WiseElder, Detective,
    Sandman, // pre-last because he freeze all other actions including Blacksmith's
    Blacksmith, // last because he can freeze action of infected but still not wolf player
]

const nightRoleResolves = [
    // PuppetMaster,
    JackOLantern,
    Harlot, //Prowler
    Martyr, WildChild, Doppelganger, // constant choices
    GuardianAngel,
    Necromancer,
    SerialKiller,
    Wolf,
    Sorcerer, Seer, Oracle,
    Thief,
]

const lynchRoleResolves = [
    Pumpkin,
]
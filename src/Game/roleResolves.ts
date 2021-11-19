import {
    Blacksmith,
    Detective, Doppelganger,
    GuardianAngel,
    Gunner, Cupid,
    Harlot, JackOLantern,
    Martyr,
    Monarch, Mayor,
    Necromancer,
    Oracle, Prowler, Pumpkin, Sandman,
    Seer,
    SerialKiller, Sorcerer,
    Thief, WildChild,
    WiseElder,
    Wolf
} from "../Roles";
import {GameStage} from "./Game";
import {Arsonist} from "../Roles/Others/Arsonist";

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
    WildChild, Martyr, Doppelganger, // constant choices
    Monarch, Mayor,
    Gunner,
    WiseElder, Detective,
    Sandman, // pre-last because he freeze all other actions including Blacksmith's
    Blacksmith, // last because he can freeze action of infected but still not wolf player
]

const nightRoleResolves = [
    WildChild, Martyr, Doppelganger, // constant choices
    Cupid,
    JackOLantern,
    Harlot, //Prowler
    GuardianAngel,
    Necromancer,
    Arsonist,
    SerialKiller,
    Wolf,
    Sorcerer, Seer, Oracle,
    Thief,
]

const lynchRoleResolves = [
    Pumpkin,
]
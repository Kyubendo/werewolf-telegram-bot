import {
    Blacksmith,
    Detective, Doppelganger,
    GuardianAngel,
    Gunner,
    Harlot, JackOLantern,
    Martyr,
    Monarch, Necromancer,
    Oracle, Pacifist, Pumpkin, Sandman,
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
    WildChild, Martyr, Doppelganger, WildChild, // constant choices
    Monarch, Pacifist, // only action
    Gunner,
    WiseElder, Detective,
    Sandman, // pre-last because he freeze all other actions including Blacksmith's
    Blacksmith, // last because he can freeze action of infected but still not wolf player
]

const nightRoleResolves = [
    WildChild, Martyr, Doppelganger, // constant choices
    // PuppetMaster,
    JackOLantern,
    Harlot, //Prowler
    GuardianAngel,
    Necromancer,
    SerialKiller,
    Wolf,
    Sorcerer, Seer, Oracle,
    Thief,
]

const lynchRoleResolves = [
    Pacifist, // only action
    Pumpkin,
]
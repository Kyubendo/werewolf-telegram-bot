import {GuardianAngel, Gunner, Harlot, Monarch, Oracle, Seer, SerialKiller, Thief, WiseElder, Wolf} from "../Roles";
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
    Monarch, // only action
    Gunner,
    WiseElder, // Detective
]

const nightRoleResolves = [
    // PuppetMaster,
    // Jack
    GuardianAngel,
    // Martyr,
    Thief,
    Harlot, //Prowler
    Wolf,
    SerialKiller,
    Seer, Oracle,
]
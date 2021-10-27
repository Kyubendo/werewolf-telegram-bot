import {
    GuardianAngel,
    Gunner,
    Harlot,
    Martyr,
    Monarch,
    Oracle,
    Seer,
    SerialKiller,
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
    Monarch, // only action
    Gunner,
    WiseElder, // Detective
]

const nightRoleResolves = [
    // PuppetMaster,
    // Jack
    Martyr,
    GuardianAngel,
    Thief,
    Harlot, //Prowler
    Wolf,
    SerialKiller,
    Seer, Oracle,
]
import {Player} from "../Player/Player";

export type specialConditionGunner = { ammo: number }
export type specialConditionMonarch = { comingOut?: boolean }
export type specialConditionSandman = { sleep?: boolean }
export type specialConditionBlacksmith = { silverDust?: boolean }
export type specialConditionWildChild = { roleModel?: Player }
export type specialConditionMartyr = { protectedPlayer?: Player }
export type specialConditionPacifist = { peace?: boolean }
export type specialConditionType = specialConditionGunner | specialConditionBlacksmith | specialConditionMartyr |
    specialConditionWildChild | specialConditionMonarch | specialConditionSandman | specialConditionPacifist

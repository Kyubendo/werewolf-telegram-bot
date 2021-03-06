import {Player} from "../Game";

export type specialConditionGunner = { ammo: number }
export type specialConditionRuler = { comingOut?: boolean }
export type specialConditionSandman = { sleep?: boolean }
export type specialConditionBlacksmith = { silverDust?: boolean }
export type specialConditionWildChild = { roleModel?: Player }
export type specialConditionMartyr = { protectedPlayer?: Player }
export type specialConditionCupid = { loversBound: boolean }
export type specialConditionPrincess = { ringShowed: boolean }
export type specialConditionPacifist = { peace?: boolean }
export type specialConditionSnowman = { snowballs: number }
export type specialConditionType = specialConditionGunner | specialConditionBlacksmith | specialConditionMartyr |
    specialConditionWildChild | specialConditionRuler | specialConditionSandman | specialConditionCupid |
    specialConditionPrincess | specialConditionPacifist | specialConditionSnowman

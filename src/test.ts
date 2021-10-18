import * as Roles from "./Roles";
import {arrayShuffle} from "./utils/arrayShuffle";
import {RoleBase} from "./Roles/RoleBase";

const playerCount = 6 // test

const basePool: RoleBase[] = [
    new Roles.Villager(), new Roles.Seer(),
    new Roles.Wolf(),
    new Roles.Suicide(),
]

if (false) { // playerCount > n
    // basePool.push(...additionalRoles)
}

const roles = arrayShuffle(basePool)

console.log(basePool)


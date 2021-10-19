import * as Roles from "./Roles";
import {arrayShuffle} from "./Utils/arrayShuffle";

const playerCount = 6 // test

const rolePool = [
    Roles.Villager, Roles.Seer,
    Roles.Wolf,
    Roles.Suicide,
]

if (false) { // playerCount > n
    // rolePool.push(...additionalRoles)
}

for (let i = rolePool.length; i < playerCount; i++) rolePool.push(Roles.Villager)

arrayShuffle(rolePool)

console.log(rolePool)


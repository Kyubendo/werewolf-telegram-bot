import {RoleBase} from "../Roles";
import {Role} from "../entity/Role";

export const balanceWeights = async (roles: RoleBase[], villagersWon: boolean) => {
    for (const r of roles) {
        const role = await Role.findOne({name: r.constructor.name})
        if (!role) throw 'balanceWeight 7';
        const curWeight = role[r.activeWeight];
        if (!curWeight) throw 'balance weight 9'
        role[r.activeWeight] = curWeight + (villagersWon ? .1 : -.1)
    }
}
import {RoleBase} from "../Roles";
import {Role} from "../entity/Role";

export const balanceWeights = async (roles: RoleBase[], villagersWon: boolean) => {
    for (const r of roles) {
        const role = await Role.findOne({name: r.constructor.name})
        if (!role) throw 'balanceWeight 7';
        const curWeight = role[r.activeWeight];
        if (!curWeight) throw 'balance weight 9';
        const balanceStep = Number(process.env.BALANCE_STEP)
        role[r.activeWeight] = +(curWeight + (villagersWon ? balanceStep : -balanceStep)).toPrecision(9)
        await role.save();
    }
}

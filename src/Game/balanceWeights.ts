import {RoleBase} from "../Roles";
import {Role} from "../entity/Role";

export const balanceWeights = async (gameRoles: RoleBase[], villagersWon: boolean) => {
    const rolesToBalance: RoleBase[] = []
    gameRoles.forEach(
        r => !rolesToBalance.map(r => r.constructor.name).includes(r.constructor.name)
            && rolesToBalance.push(r)
    )
    for (const r of rolesToBalance) {
        const role = await Role.findOne({name: r.constructor.name})
        if (!role) throw 'balanceWeight 7';
        const curWeight = role[r.activeWeight];
        if (curWeight === null) throw 'balance weight 9';
        const balanceStep = Number(process.env.BALANCE_STEP || 0)
        const stepValue = villagersWon ? balanceStep : -balanceStep;
        role[r.activeWeight] = +(curWeight + stepValue).toPrecision(9)
        if (r.weightCoefficientVariable) {
            if (role.weightCoefficient === null) throw 'balanceWeight 13';
            role.weightCoefficient = +(role.weightCoefficient +
                (stepValue * r.weightCoefficientVariable)).toPrecision(9)
        }
        await role.save();
    }
}

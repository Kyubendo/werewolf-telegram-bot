import {RoleBase} from "../Abstract/RoleBase";
import {specialConditionPrincess} from "../../Utils/specialConditionTypes";

export class Princess extends RoleBase {
    roleName = 'Принцесса 💍';
    roleIntroductionText = () => `Ты скрывающаяся ${this.roleName}, `
    startMessageText = () => 'сбежавшая от своей скучной, изнеженной жизни, чтобы провести день среди деревенщин. '
        + 'Если они попытаются казнить тебя, они совершат огромную ошибку, и никто не будет казнен.'
    weight = () => 2;
    specialCondition: specialConditionPrincess = {ringShowed: false}
}
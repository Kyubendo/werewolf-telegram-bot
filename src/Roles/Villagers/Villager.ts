import {RoleBase} from "../";

export class Villager extends RoleBase {
    roleName = 'Селянин 👱';
    roleIntroductionText = () => `Ты простой ${this.roleName}`;
    startMessageText = () => `и твоя задача — найти и казнить волка!`;
}

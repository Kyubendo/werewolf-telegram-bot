import {RoleBase} from "../Abstract/RoleBase";

export class Villager extends RoleBase {
    roleName = 'Селянин 👱';
    roleIntroductionMessage = () => `Ты простой ${this.roleName} `;
    startMessageText = () => `и твоя задача — найти и казнить волка!`;
    weight = () => 1;
}

import {RoleBase} from "../RoleBase";

export class Villager extends RoleBase {
    roleName = 'Селянин 👱';
    startMessageText = () => `Ты простой ${this.roleName} и твоя задача — найти и казнить волка!`;
    weight = () => 1;
}

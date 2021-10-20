import {RoleBase} from "../RoleBase";

export class Villager extends RoleBase {
    roleName = 'Селянин';
    startMessageText = 'Ты простой Селянин и твоя задача — найти и казнить волка!';
    weight = 1;
}

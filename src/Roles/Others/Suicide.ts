import {RoleBase} from "../RoleBase";

export class Suicide extends RoleBase {
    roleName = 'Самоубийца 👺';
    startMessageText = `Ты ${this.roleName}! Если тебя казнят, ты выиграл!`;
    weight = () => -4;
}

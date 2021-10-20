import {RoleBase} from "../RoleBase";

export class Suicide extends RoleBase {
    roleName = 'Самоубийца';
    startMessageText = 'Ты Самоубийца! Если тебя казнят, ты выиграл!';
    weight = () => -4;
}

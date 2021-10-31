import {RoleBase} from "../../Game";

export class Pumpkin extends RoleBase {
    roleName = 'Тыква 🍑';
    startMessageText = () => 'Ты проиграл!';
    weight = () => 0;

    action = () => {

    }
}
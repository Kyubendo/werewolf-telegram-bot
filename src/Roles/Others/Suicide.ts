import {RoleBase} from "../Abstract/RoleBase";

export class Suicide extends RoleBase {
    roleName = 'Самоубийца 👺';
    startMessageText = () =>`Если тебя казнят, ты выиграл!`;
    weight = () => -4;
}

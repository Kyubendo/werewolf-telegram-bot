import {RoleBase} from "../Abstract/RoleBase";

export class Suicide extends RoleBase {
    roleName = 'Самоубийца 👺';
    startMessageText = () => `Кажется, тебе надоело жить... Добейся своей казни, и ты выиграешь, ` +
        `ведь ты ${this.roleName}...`;
    weight = () => -4;
}

import {RoleBase} from "../";

export class Suicide extends RoleBase {
    roleName = 'Самоубийца 👺';
    roleIntroductionText = () => ''
    startMessageText = () => `Кажется, тебе надоело жить... Добейся своей казни, и ты выиграешь, ` +
        `ведь ты ${this.roleName}...`;
    weight = () => Suicide.game.players.length / -2;
}

import {RoleBase} from "../";

export class Traitor extends RoleBase {
    roleName = 'Предатель 🖕';
    roleIntroductionText = () => `Ты ${this.roleName}.`
    startMessageText = () => `Вот ты сейчас простой селянин, а убьют волков - станешь последним ` +
        `в их роде!`;
}
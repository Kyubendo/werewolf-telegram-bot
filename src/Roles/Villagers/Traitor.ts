import {RoleBase} from "../Abstract/RoleBase";

export class Traitor extends RoleBase {
    roleName = 'Предатель 🖕';
    startMessageText = () =>`Ты ${this.roleName}. Вот ты сейчас простой селянин, а убьют волков - станешь последним ` +
        `в их роде!`;
    weight = () => 0;
}
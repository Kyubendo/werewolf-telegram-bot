import {Villager} from "./Villager";

export class Traitor extends Villager {
    roleName = 'Предатель 🖕';
    roleIntroductionText = () => `Ты ${this.roleName}. `
    startMessageText = () => `Вот ты сейчас простой селянин, а убьют волков - станешь последним ` +
        `в их роде!`;
    weight = () => 0;
}
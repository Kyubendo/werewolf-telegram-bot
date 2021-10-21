import {Villager} from "./Villager";

export class Traitor extends Villager {
    roleName = 'Предатель 🖕';
    startMessageText = 'Ты Предатель. Вот ты сейчас простой селянин, а убьют волков - станешь последним в их роде!';
    weight = () => 0;

    //changes to Wolf if all Wolves are dead
}
import {VillagerBase} from "./VillagerBase";

export class Seer extends VillagerBase {
    roleName = 'Провидец';
    startMessageText = 'Ты Провидец! Каждую ночь ты можешь выбрать человека, чтобы "увидеть" его роль.  ';
    weight = 7;

    nightAction = () => {

    };
}

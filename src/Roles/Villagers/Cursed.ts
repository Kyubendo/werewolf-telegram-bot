import {VillagerBase} from "./VillagerBase";

export class Cursed extends VillagerBase {
    roleName = 'Проклятый';
    startMessageText = 'Ты Проклятый! Сейчас ты обычный смертный, ' +
        'но если волки выберут тебя съесть, ты станешь одним из них.';
    weight = 0;
}
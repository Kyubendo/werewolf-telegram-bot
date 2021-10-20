import {Villager} from "./Villager";

export class Cursed extends Villager {
    roleName = 'Проклятый';
    startMessageText = 'Ты Проклятый! Сейчас ты обычный смертный, ' +
        'но если волки выберут тебя съесть, ты станешь одним из них.';
    weight = -3;
}
import {VillagerBase} from "./VillagerBase";

export class ClumsyGuy extends VillagerBase {
    roleName = 'Недотёпа';
    startMessageText = 'Ты Недотепа… Ах, женщины всегда выбирают не тех! ' +
        'Должно быть, это у них в крови – ошибаться в мужчинах, в знакомых, в подругах… ' +
        'И в голосовании. У тебя 50% шанс проголосовать за случайного игрока.';
    weight = 1000000;
}
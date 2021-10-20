import {Villager} from "./Villager";

export class ClumsyGuy extends Villager {
    roleName = 'Недотёпа';
    startMessageText = 'Ты Недотепа… Ах, женщины всегда выбирают не тех! ' +
        'Должно быть, это у них в крови – ошибаться в мужчинах, в знакомых, в подругах… ' +
        'И в голосовании. У тебя 50% шанс проголосовать за случайного игрока.';
    weight = () => 0;
}
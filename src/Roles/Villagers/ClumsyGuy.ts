import {RoleBase} from "../Abstract/RoleBase";

export class ClumsyGuy extends RoleBase {
    roleName = 'Недотёпа 🤕';
    roleIntroductionText = () => `Ты ${this.roleName}… `
    startMessageText = () => `Ах, женщины всегда выбирают не тех! ` +
        'Должно быть, это у них в крови – ошибаться в мужчинах, в знакомых, в подругах… ' +
        'И в голосовании. У тебя 50% шанс проголосовать за случайного игрока.';
    weight = () => 0;
}
import {Villager} from "./Villager";
import {RoleBase} from "../RoleBase";

export class Mason extends Villager {
    roleName = 'Каменщик';
    startMessageText = 'Тебе ничего не остается делать, кроме как идти и пахать на стройке, ведь ты Каменщик.';
    weight = () => {
        let otherMasons = RoleBase.game.players.filter(player => player.role instanceof Mason &&
            player !== this.player); // Найти всех Каменщиков в игре кроме самого игрока
        return (otherMasons.length > 0 ? 3 : 1) + otherMasons.length;
        // Если Каменщик 1, то сила - 1.
        // Если Каменщиков 2 и больше, то сила каждого 3 + количество других Каменщиков в игре
    }
}
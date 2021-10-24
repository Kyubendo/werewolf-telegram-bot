import {Seer} from "./Seer";
import {findPlayer} from "../../Game/findPlayer";

export class Oracle extends Seer {
    roleName = 'Оракул 🌀';
    startMessageText = () => `Ты ${this.roleName}. Каждую ночь ты можешь ` +
        'выбрать игрока и узнать кем он НЕ является. Обрати внимание Тебе скажут роль кого-то другого в игре, ' +
        'кто всё ещё жив :)';
    weight = () => 4;

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Oracle.game.players);
        this.choiceMsgEditText();
        const otherPlayers = Oracle.game.players.filter(player => player !== this.player
            && player.isAlive
            && player !== this.targetPlayer);
        this.targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    }

    forecastRoleName = () => `НЕ *${this.targetPlayer?.role?.roleName}*!`;

}
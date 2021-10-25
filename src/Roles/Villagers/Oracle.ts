import {ForecasterBase} from "../Abstract/ForecasterBase";
import {RoleBase} from "../Abstract/RoleBase";

export class Oracle extends ForecasterBase {
    roleName = 'Оракул 🌀';
    startMessageText = () => `Ты ${this.roleName}. Каждую ночь ты можешь ` +
        'выбрать игрока и узнать кем он НЕ является. Обрати внимание: тебе скажут роль кого-то другого в игре, ' +
        'кто всё ещё жив :)';
    weight = () => 4;

    forecastRoleName = (targetRole: RoleBase) => {
        const otherPlayers = Oracle.game.players.filter(player => player !== this.player
            && player.isAlive
            && player !== targetRole.player);
        const otherRole = otherPlayers[Math.floor(Math.random() * otherPlayers.length)].role;
        return `НЕ ${otherRole?.roleName}!`;
    }

}
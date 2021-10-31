import {ForecasterBase} from "../Abstract/ForecasterBase";
import {RoleBase} from "../Abstract/RoleBase";
import {randomElement} from "../../Utils/randomElement";
import {findPlayer} from "../../Game/findPlayer";

export class Oracle extends ForecasterBase {
    roleName = 'Оракул 🌀';
    roleIntroductionText = () => `Ты ${this.roleName}. `
    startMessageText = () => `Каждую ночь ты можешь ` +
        'выбрать игрока и узнать кем он НЕ является. Обрати внимание: тебе скажут роль кого-то другого в игре, ' +
        'кто всё ещё жив :)';
    weight = () => 4;

    nightActionDone = false

    forecastRoleName = (targetRole: RoleBase) => {
        const otherPlayers = Oracle.game.players.filter(player => player !== this.player
            && player.isAlive
            && player !== targetRole.player);
        const otherRole = randomElement(otherPlayers).role;
        return `НЕ *${otherRole?.roleName}*`;
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, ForecasterBase.game.players)
        this.choiceMsgEditText();
        this.doneNightAction()
    }
}
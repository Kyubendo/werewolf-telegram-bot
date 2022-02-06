import {RoleBase, ForecasterBase} from "../"
import {randomElement} from "../../Utils/randomElement";
import {findPlayer} from "../../Game/findPlayer";

export class Oracle extends ForecasterBase {
    roleName = 'Оракул 🧿';
    roleIntroductionText = () => `Ты ${this.roleName}.`
    startMessageText = () => `Каждую ночь ты можешь ` +
        'выбрать игрока и узнать кем он НЕ является. Обрати внимание: тебе скажут роль кого-то другого в игре, ' +
        'кто всё ещё жив.';

    nightActionDone = false

    forecastRoleName = (targetRole: RoleBase) => {
        const otherRoles = Oracle.game.players
            .filter(p => p.isAlive && p !== this.player)
            .map(p => p.role)
            .filter(r => r?.constructor !== targetRole.constructor);
        const otherRole = randomElement([...new Set(otherRoles)]);
        return otherRole ? `НЕ *${otherRole?.roleName}*!` : 'это ты сам...';
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, ForecasterBase.game.players)
        this.choiceMsgEditText();
        this.doneNightAction()
    }
}
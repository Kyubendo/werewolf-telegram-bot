import {RoleBase} from "../";
import {DeathType, Player} from "../../Game";

export class Suicide extends RoleBase {
    roleName = 'Самоубийца 👺';
    roleIntroductionText = () => ''
    startMessageText = () => `Кажется, тебе надоело жить... Добейся своей казни, и ты выиграешь, ` +
        `ведь ты ${this.roleName}...`;
    weight = () => Suicide.game.players.length / -2;

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if (killer === undefined) {
            await RoleBase.game.onGameEnd({winners: [this.player], type: 'suicide'})
            RoleBase.game.stopStage()
        }
        return super.handleDeath(killer, type);
    }
}

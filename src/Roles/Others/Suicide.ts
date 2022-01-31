import {RoleBase, RoleWeights} from "../";
import {DeathType, Player} from "../../Game";

export class Suicide extends RoleBase {
    roleName = 'Самоубийца 👺';
    roleIntroductionText = () => ''
    startMessageText = () => `Кажется, тебе надоело жить... Добейся своей казни, и ты выиграешь, ` +
        `ведь ты ${this.roleName}...`;

    weight = (w: RoleWeights) => {
        const playersAmount = Suicide.game.players.length;

        this.activeWeightCoefficient = 'weightCoefficient';
        const coefficient = w[this.activeWeightCoefficient];

        this.weightCoefficientVariable = playersAmount;

        if (coefficient === null) throw 'ERROR Others/Suicide 16'

        return coefficient * playersAmount;
    }

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if (killer === undefined) {
            await RoleBase.game.onGameEnd({winners: [this.player], type: 'suicide'})
            RoleBase.game.stopStage()
        }
        return super.handleDeath(killer, type);
    }
}

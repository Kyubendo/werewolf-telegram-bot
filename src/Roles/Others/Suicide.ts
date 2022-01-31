import {RoleBase, RoleWeights} from "../";

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
}

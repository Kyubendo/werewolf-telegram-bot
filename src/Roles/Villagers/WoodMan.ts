import {RoleBase, RoleWeights, Seer} from "../";

export class WoodMan extends RoleBase {
    roleName = 'Лесник 🧔‍♂‍🌚';
    roleIntroductionText = () => `Ты скромный селянин - ${this.roleName},`
    startMessageText = () =>`но поскольку большую часть времени ты проводишь ` +
        `в лесу, где есть настоящие волки, провидец может запутаться и подумать, что вы волк! О, нет...`;
    weight = (w: RoleWeights) => {
        this.activeWeight = RoleBase.game.players.find(player => player.role instanceof Seer)
            ? "conditionWeight"
            : "baseWeight"
        return w[this.activeWeight];
    }
}
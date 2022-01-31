import {RoleWeights, Seer, Wolf} from "../";


export class Lycan extends Wolf {
    roleName = 'Ликан 🐺🌝';
    startMessageText = () => `Ты волк, но провидец видит тебя селянином.`
    weight = (w: RoleWeights) => {
        this.activeWeight = Wolf.game.players.find(player => player.role instanceof Seer)
            ? "conditionWeight"
            : "baseWeight";
        return w[this.activeWeight];
    }
}
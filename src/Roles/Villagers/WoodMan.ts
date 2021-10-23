import {Villager} from "./Villager";
import {RoleBase} from "../RoleBase";
import {Seer} from "./Seer";

export class WoodMan extends Villager {
    roleName = 'Лесник 🧔‍♂‍🌚';
    startMessageText = `Ты скромный селянин - ${this.roleName}, но поскольку большую часть времени ты проводишь ` +
        `в лесу, где есть настоящие волки, провидец может запутаться и подумать, что вы волк! О, нет...`;
    weight = () => RoleBase.game.players.find(player => player.role instanceof Seer) ? -1 : 1;
}
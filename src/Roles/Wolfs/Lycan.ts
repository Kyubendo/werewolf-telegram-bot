import {Wolf} from "./Wolf";
import {RoleBase} from "../RoleBase";
import {Seer} from "../Villagers/Seer";

export class Lycan extends Wolf {
    roleName = 'Ликан';
    startMessageText = 'Ты Ликан! Ты волк, но провидец видит тебя селянином :)';
    weight = () => RoleBase.game.players.find(player => player.role instanceof Seer) ? -12 : -10;
}
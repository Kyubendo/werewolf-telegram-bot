import {Wolf} from "./Wolf";
import {Seer} from "../Villagers/Seer";

export class Lycan extends Wolf {
    roleName = 'Ликан 🐺🌝';
    startMessageText = () => `Ты волк, но провидец видит тебя селянином.` + this.getAlliesMessage();
    weight = () => Wolf.game.players.find(player => player.role instanceof Seer) ? -12 : -10;
}
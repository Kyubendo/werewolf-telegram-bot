import {Seer, Wolf} from "../";


export class Lycan extends Wolf {
    roleName = 'Ликан 🐺🌝';
    startMessageText = () => `Ты волк, но провидец видит тебя селянином.`
    weight = () => Wolf.game.players.find(player => player.role instanceof Seer) ? -10 : -8;
}
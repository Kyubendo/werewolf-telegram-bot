import {Seer, Wolf} from "../index";

export class Lycan extends Wolf {
    roleName = 'Ликан 🐺🌝';
    startMessageText = () => `Ты волк, но провидец видит тебя селянином :)` + this.showOtherWolfPlayers();
    weight = () => Wolf.game.players.find(player => player.role instanceof Seer) ? -12 : -10;
}
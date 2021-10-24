import {Wolf} from "./Wolf";
import {Seer} from "../Villagers/Seer";
import {Player} from "../../Player/Player";

export class Lycan extends Wolf {
    allies?: Player[] = Lycan.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Wolf
        && otherPlayer !== this.player
        && otherPlayer.isAlive
    );

    roleName = 'Ликан 🐺🌝';
    startMessageText = () =>`Ты ${this.roleName}! Ты волк, но провидец видит тебя селянином :)` + this.showWolfPlayers();
    weight = () => Wolf.game.players.find(player => player.role instanceof Seer) ? -12 : -10;
}
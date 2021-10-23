import {Villager} from "./Villager";
import {alliesMessage, findAllies} from "../../Game/findAllies";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Mason extends Villager {
    roleName = 'Каменщик 👷';
    startMessageText = `Тебе ничего не остается делать, кроме как идти и пахать на стройке, ведь ты ${this.roleName}.`
        + alliesMessage(this.player);
    weight = () => {
        const otherMasonsAmount = findAllies(this.player).length;
        return (otherMasonsAmount ? 3 : 1) + otherMasonsAmount;
    }

    handleDeath(killer?: Player): boolean {
        Mason.game.bot.sendMessage(
            Mason.game.chatId,
            `Проснувшись, все находят тело ${highlightPlayer(this.player)} под грудой ` +
            `камней, кровь разбрызгана повсюду. ${this.player.role?.roleName} мертв!`
        )
        this.player.isAlive = false;
        return true;
    }
}
import {Villager} from "./Villager";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Mason extends Villager {
    findMasonPlayers = () => Mason.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Mason
        // && otherPlayer !== this.player
        && otherPlayer.isAlive
    )

    showMasonPlayers = () => {
        const allies = this.findMasonPlayers();
        return `${allies?.length ? ('\nКаменщики: '
            + allies?.map(ally => highlightPlayer(ally)).join(', ')) : ''}`
    }

    roleName = 'Каменщик 👷';
    startMessageText = `Тебе ничего не остается делать, кроме как идти и пахать на стройке, ведь ты ${this.roleName}.`
        + this.showMasonPlayers();
    weight = () => {
        const otherMasonsAmount = this.findMasonPlayers().length;
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
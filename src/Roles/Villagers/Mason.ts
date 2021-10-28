import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RoleBase} from "../Abstract/RoleBase";

export class Mason extends RoleBase {
    findOtherMasonPlayers = () => Mason.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Mason
        && otherPlayer !== this.player
        && otherPlayer.isAlive
    )

    showOtherMasonPlayers = () => {
        const allies = this.findOtherMasonPlayers();
        return `${allies?.length > 0
            ? '\n' + ((allies.length > 1
                ? 'Другие каменщики: '
                : 'Твой напарник по стройке — ')
            + allies?.map(ally => highlightPlayer(ally)).join(', '))
            : ''}`
    }

    roleName = 'Каменщик 👷';
    startMessageText = () => `Тебе ничего не остается делать, кроме как идти и пахать на стройке, ` +
        `ведь ты ${this.roleName}.` + this.showOtherMasonPlayers();
    weight = () => {
        const otherMasonsAmount = this.findOtherMasonPlayers().length;
        return (otherMasonsAmount ? 3 : 1) + otherMasonsAmount;
    }

    handleDeath(killer?: Player): boolean {
        Mason.game.bot.sendMessage(
            Mason.game.chatId,
            `Проснувшись, все находят тело ${highlightPlayer(this.player)} под грудой ` +
            `камней, кровь разбрызгана повсюду. *${this.roleName}* мертв!`
        )
        this.player.isAlive = false;
        return true;
    }
}
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RoleBase} from "../Abstract/RoleBase";

export class Mason extends RoleBase {
    findMasonPlayers = () => Mason.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Mason
        // && otherPlayer !== this.player
        && otherPlayer.isAlive
    )

    showMasonPlayers = () => {
        const allies = this.findMasonPlayers();
        return `${allies?.length > 1 ? ('\nКаменщики: '
            + allies?.map(ally => highlightPlayer(ally)).join(', ')) : ''}`
    }

    roleName = 'Каменщик 👷';
    roleIntroductionText = () => ''
    startMessageText = () =>`Тебе ничего не остается делать, кроме как идти и пахать на стройке, `+
        `ведь ты ${this.roleName}.` + this.showMasonPlayers();
    weight = () => {
        const otherMasonsAmount = this.findMasonPlayers().length;
        return (otherMasonsAmount ? 3 : 1) + otherMasonsAmount;
    }

    handleDeath = (killer?: Player): boolean => {
        Mason.game.bot.sendMessage(
            Mason.game.chatId,
            `Проснувшись, все находят тело ${highlightPlayer(this.player)} под грудой ` +
            `камней, кровь разбрызгана повсюду. *${this.roleName}* мертв!`
        )
        this.player.isAlive = false;
        return true;
    }
}
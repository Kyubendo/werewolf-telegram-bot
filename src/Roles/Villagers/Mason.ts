import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {DeathType, RoleBase} from "../../Game";

export class Mason extends RoleBase {
    findOtherMasonPlayers = () => Mason.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Mason
        && otherPlayer !== this.player
        && otherPlayer.isAlive
    )

    showOtherMasonPlayers = () => {
        const allies = this.findOtherMasonPlayers();
        if (!allies?.length) return ''
        return (allies?.length > 1
            ? '\nКаменщики: '
            : '\nТвой напарник на стройке — ')
            + allies?.map(ally => highlightPlayer(ally)).join(', ')
    }

    roleName = 'Каменщик 👷';
    roleIntroductionText = () => ''
    startMessageText = () => `Тебе ничего не остается делать, кроме как идти и пахать на стройке, ` +
        `ведь ты ${this.roleName}.` + this.showOtherMasonPlayers();
    weight = () => {
        const otherMasonsAmount = this.findOtherMasonPlayers().length;
        return (otherMasonsAmount ? 3 : 1) + otherMasonsAmount;
    }

    handleDeath(killer?: Player, type?: DeathType): boolean {
        Mason.game.bot.sendMessage(
            Mason.game.chatId,
            `Проснувшись, все находят тело ${highlightPlayer(this.player)} под грудой ` +
            `камней, кровь разбрызгана повсюду. *${this.roleName}* мертв!`
        )

        killer?.role?.killMessageDead && Mason.game.bot.sendMessage(
            this.player.id,
            killer?.role?.killMessageDead
        )
        this.player.isAlive = false;
        return true;
    }
}
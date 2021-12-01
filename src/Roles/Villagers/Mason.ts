import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {DeathType} from "../../Game";
import {RoleBase} from "../index";

export class Mason extends RoleBase {
    findOtherMasonPlayers = () => Mason.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Mason
        && otherPlayer !== this.player
        && otherPlayer.isAlive
    )

    stealMessage = (): string => {
        const allies = this.findOtherMasonPlayers();
        if (!allies?.length) return ''
        return (allies?.length > 1
                ? '\nКаменщики: '
                : '\nТвой напарник на стройке — ')
            + allies?.map(ally => highlightPlayer(ally)).join(', ')
    }

    newMemberNotification = (newMember: Player, oldMember?: Player): void => {
        Mason.game.bot.sendMessage(
            this.player.id,
            oldMember
                ? `Странно, ${highlightPlayer(newMember)} пришёл на собрание ` +
                `каменщиков вместо ${highlightPlayer(oldMember)}! ${highlightPlayer(oldMember)} уволен за прогул!`
                : `${highlightPlayer(newMember)} пришёл на стройку по объявлению. ` +
                `Да, опыта у него нет... но он закончил аж 8 классов! Встречайте нового камещика!`
        )
    }

    roleName = 'Каменщик 👷';
    roleIntroductionText = () => ''
    startMessageText = () => `Тебе ничего не остается делать, кроме как идти и пахать на стройке, ` +
        `ведь ты ${this.roleName}.` + this.stealMessage();
    weight = () => {
        const otherMasonsAmount = this.findOtherMasonPlayers().length;
        return (otherMasonsAmount ? 3 : 1) + otherMasonsAmount;
    }

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if (killer?.role && !type) {
            await Mason.game.bot.sendMessage(
                Mason.game.chatId,
                `Проснувшись, все находят тело ${highlightPlayer(this.player)} под грудой ` +
                `камней, кровь разбрызгана повсюду. *${this.roleName}* мертв!`
            )

            killer?.role?.killMessage && await Mason.game.bot.sendAnimation(
                this.player.id,
                killer?.role?.killMessage().gif,
                {
                    caption: killer.role.killMessage().text.toTarget
                }
            )
            this.player.isAlive = false;
            return true;
        } else
            return super.handleDeath(killer, type);
    }
}
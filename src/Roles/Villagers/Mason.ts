import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {DeathType} from "../../Game";
import {RoleBase} from "../index";

export class Mason extends RoleBase {
    findAllies = () => Mason.game.players.filter(otherPlayer =>
        otherPlayer.role instanceof Mason
        && otherPlayer !== this.player
        && otherPlayer.isAlive
    )

    getAlliesMessage = async (notify?: boolean): Promise<string> => {
        const allies = this.findAllies();
        if (notify)
            for (const ally of allies)
                await Mason.game.bot.sendMessage(
                    ally.id,
                    `${highlightPlayer(this.player)} пришёл на стройку по объявлению. ` +
                    `Да, опыта у него нет... но он закончил аж 8 классов! Встречайте нового камещика 🎉!`
                )


        if (!allies?.length) return ''
        return (allies?.length > 1
                ? '\nКаменщики: '
                : '\nТвой напарник на стройке — ')
            + allies?.map(ally => highlightPlayer(ally)).join(', ')
    }

    roleName = 'Каменщик 👷';
    roleIntroductionText = () => ''
    startMessageText = () => `Тебе ничего не остается делать, кроме как идти и пахать на стройке, ` +
        `ведь ты ${this.roleName}.` + this.getAlliesMessage();
    weight = () => {
        const otherMasonsAmount = this.findAllies().length;
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
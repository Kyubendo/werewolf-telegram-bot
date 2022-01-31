import {playerLink} from "../../Utils/playerLink";
import {ForecasterBase, RoleBase, Wolf} from "../";

export class Detective extends ForecasterBase {
    roleName = 'Детектив 🕵️';
    roleIntroductionText = () => `Ты ${this.roleName}.`
    startMessageText = () => 'Ты можешь выбрать игрока днем, чтобы узнать его роль. ' +
        'Но волк узнает, кто ты, если ты выберешь его!'

    actionResult = async () => {
        setTimeout(() => console.log('Detective 12'), 1000 * 60 * 15)
        if (!this.targetPlayer) {
            setTimeout(() => console.log('No targetPlayer Detective 14'), 1000 * 60 * 15)
            return;
        }
        if (!this.targetPlayer.role) {
            setTimeout(() => console.log('No targetPlayer.role Detective 15'), 1000 * 60 * 15)
            return;
        }
        await Detective.game.bot.sendMessage(
            this.player.id,
            this.forecastRoleName(this.targetPlayer.role)
        )
        if (this.targetPlayer.role instanceof Wolf)
            await Detective.game.bot.sendMessage(
                this.targetPlayer.id,
                `Ты поймал что-то выискивающего ${playerLink(this.player)}! Он ${this.roleName}!`
            )

    }

    forecastRoleName = (targetRole: RoleBase) =>
        `Твои выслеживания показали, что ${playerLink(targetRole.player)} ` +
        `это *${targetRole.roleName}*.`
}
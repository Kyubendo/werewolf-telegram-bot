import {ForecasterBase} from "../Abstract/ForecasterBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RoleBase} from "../Abstract/RoleBase";
import {Wolf} from "../WolfTeam/Wolf";

export class Detective extends ForecasterBase {
    roleName = 'Детектив 🕵️';
    roleIntroductionText = () => `Ты ${this.roleName}.`
    startMessageText = () => 'Ты можешь выбрать игрока днем, чтобы узнать его роль. ' +
        'Но волк узнает, кто ты, если ты выберешь его!'
    weight = () => 7;

    actionResult = () => {
        if (!this.targetPlayer?.role) return;

        Detective.game.bot.sendMessage(
            this.player.id,
            this.forecastRoleName(this.targetPlayer.role)
        )
        if (this.targetPlayer.role instanceof Wolf)
            Detective.game.bot.sendMessage(
                this.targetPlayer.id,
                `Ты поймал что-то выискивающего ${highlightPlayer(this.player)}! Он ${this.roleName}!`
            )

    }

    forecastRoleName = (targetRole: RoleBase) =>
        `Твои выслеживания показали, что ${highlightPlayer(targetRole.player)} ` +
        `это *${targetRole.roleName}*.`
}
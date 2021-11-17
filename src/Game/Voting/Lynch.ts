import {GameStage} from "../Game";
import {Monarch, Pumpkin, Suicide, Princess} from "../../Roles";
import {Player} from "../../Player/Player";
import {VotingBase} from "./VotingBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Lynch extends VotingBase {
    voteStage: GameStage = 'lynch'
    type = 'lynch'
    votePromptMessage = 'За кого ты хочешь проголосовать?'

    getVoters = () => {
        const activeMonarchs = this.getActiveMonarchs()
        return activeMonarchs.length ? activeMonarchs : this.game.players
            .filter(p => p.isAlive && !(p.role instanceof Pumpkin))
    }

    voteTargetCondition = (otherPlayer: Player) => otherPlayer.isAlive

    getActiveMonarchs = () => this.game.players
        .filter(player => player.role instanceof Monarch && player.role.specialCondition.comingOut && player.isAlive);

    handleVotingChoiceResult = () => {
        this.game.bot.sendMessage(
            this.game.chatId,
            `${this.votedPlayers.length} из ${this.getVoters().length} игроков проголосовало.`
        )
        if (this.votedPlayers.length === this.getVoters().length) this.game.setNextStage()
    }

    handleVoteResult(voteResult: Player[]) {
        if (voteResult.length === 1) {
            if (voteResult[0].role instanceof Suicide) {
                this.game.onGameEnd({winners: [voteResult[0]], type: 'suicide'})
                return true
            } else if (voteResult[0].role instanceof Princess && !voteResult[0].role.specialCondition.ringShowed) {
                this.game.bot.sendMessage(
                    this.game.chatId,
                    `Как только селяне решили казнить ${highlightPlayer(voteResult[0])}, она воскликнула `
                    + `“Постойте! Я Принцесса! Это королевское кольцо, эта печать короля все подтверждают! `
                    + `Каждую ночь я в окружении слуг, так что я не могу быть злой!” `
                    + `Почувствовав себя глупо, смущенные жители разошлись спать.`
                )
                voteResult[0].role.specialCondition.ringShowed = true
            } else {
                voteResult[0].role?.onKilled()
            }
        } else {
            this.game.bot.sendMessage(this.game.chatId,
                'Не удалось придти к одному решению! Расстроенная толпа расходится по домам...')
        }
    }
}

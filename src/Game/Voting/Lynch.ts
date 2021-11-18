import {GameStage} from "../Game";
import {ClumsyGuy, Monarch, Pumpkin, Suicide} from "../../Roles";
import {Player} from "../../Player/Player";
import {VotingBase} from "./VotingBase";
import {randomElement} from "../../Utils/randomElement";

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

    defineTarget = (voter: Player, target?: Player) => {
        if (target && voter.role instanceof ClumsyGuy && Math.random() < .5) {
            this.game.bot.sendMessage(
                voter.id,
                'Кажется ты опять что-то напутала и отдала свой голос не за того...')
            return randomElement(this.game.players.filter(otherPlayer =>
                otherPlayer !== voter
                && otherPlayer !== target
                && this.voteTargetCondition(otherPlayer)))
        }
        return target
    }

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
            } else {
                voteResult[0].role?.onKilled()
            }
        } else {
            this.game.bot.sendMessage(this.game.chatId,
                'Не удалось придти к одному решению! Расстроенная толпа расходится по домам...')
        }
    }
}

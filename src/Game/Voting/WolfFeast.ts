import {VotingBase} from "./VotingBase";
import {GameStage} from "../Game";
import {Player} from "../../Player/Player";
import {Wolf} from "../../Roles";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class WolfFeast extends VotingBase {
    voteStage: GameStage = 'night';

    votePromptMessage = 'Кого ты хочешь съесть?'

    getVoters = () => this.game.players.filter(player => player.isAlive && player.role instanceof Wolf)

    voteTargetCondition = (otherPlayer: Player) => otherPlayer.isAlive && !(otherPlayer.role instanceof Wolf)

    beforeVotingAction = () => this.getVoters().length > 1
        && this.getVoters().forEach(player => this.game.bot.sendMessage(
            player.id,
            'Ты со стаей собрался покушать.'
        ))

    handleVoteResult = (voteResults: Player[]) => {
        if (!voteResults.length) {
            if (this.getVoters().length > 1) {
                this.getVoters().forEach(voter => this.game.bot.sendMessage(
                    voter.id,
                    'Ваша стая слишком долго выла на луну и вы не заметили как прошла ночь. Вы никого не съели!'
                ))
            }
            return;
        }

        const killerWolf = this.getVoters()[Math.floor(Math.random() * this.getVoters().length)].role
        if (killerWolf) killerWolf.targetPlayer = voteResults[Math.floor(Math.random() * voteResults.length)]
    }

    handleVotingChoiceResult = (voter: Player, target?: Player) =>
        this.getVoters().filter(player => player !== voter).forEach(player => this.game.bot.sendMessage(
            player.id,
            target
                ? `${highlightPlayer(voter)} облизывается на ${highlightPlayer(target)}.`
                : `${highlightPlayer(voter)} облизывается в ожидании решения.`
        ))
}
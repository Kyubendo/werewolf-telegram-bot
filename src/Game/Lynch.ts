import {Game} from "./Game";
import {generateInlineKeyboard} from "./playersButtons";
import TelegramBot from "node-telegram-bot-api";
import {findPlayer} from "./findPlayer";
import {highlightPlayer} from "../Utils/highlightPlayer";
import {Monarch} from "../Roles";

export class Lynch {
    constructor(readonly game: Game) {
    }

    votes: { [id: number]: number } = {}
    countVotes = () => Object.values(this.votes).reduce((a, c) => a + c, 0)
    getActiveMonarchs = () => this.game.players
        .filter(player => player.role instanceof Monarch && player.role.comingOut && player.isAlive);

    startVoting = () => {
        const activeMonarchs = this.getActiveMonarchs();

        (activeMonarchs.length ? activeMonarchs : this.game.players).forEach(player => {
                this.game.bot.sendMessage(
                    player.id,
                    'За кого ты хочешь проголосовать?',
                    {
                        reply_markup: generateInlineKeyboard(
                            this.game.players.filter(otherPlayer => otherPlayer !== player && otherPlayer.isAlive))
                    }
                ).then(msg => {
                    if (player.role) player.role.choiceMsgId = msg.message_id
                })
            }
        )
    }


    handleVotingChoice = (query: TelegramBot.CallbackQuery) => {
        if (!query || this.game.stage !== 'lynch') return;
        const voter = findPlayer(query.from.id, this.game.players)
        const target = findPlayer(query.data, this.game.players)
        if (!target || !voter || !voter.role) return;

        const voteWeight = 1 // Mayor exception

        this.votes[target.id] ? this.votes[target.id] += voteWeight : this.votes[target.id] = voteWeight

        this.game.bot.editMessageText(
            `Выбор принят: ${highlightPlayer(target) || 'Пропустить'}.`,
            {
                message_id: voter.role.choiceMsgId,
                chat_id: voter.id,
            })

        const votersCount = this.getActiveMonarchs().length
            || this.game.players.filter(player => player.isAlive).length
        const votesCount = this.countVotes() // Mayor exception
        this.game.bot.sendMessage(
            this.game.chatId,
            `${votesCount} из ${votersCount} игороков проголосовало.`
        ).then(() => {
            if (votersCount === votesCount) {
                this.handleLynchKill() // async fix?
                this.game.setNextStage()
            }
        })
    }

    handleLynchKill = () => {
        let maxVotesTarget: number | undefined
        let equalVotesCount = 0
        Object.keys(this.votes).reduce((a, c) => {
            if (this.votes[+c] > a) {
                maxVotesTarget = +c
                return this.votes[+c]
            } else if (this.votes[+c] === a) equalVotesCount++
            return a
        }, 0)

        maxVotesTarget && equalVotesCount === 1
            ? findPlayer(maxVotesTarget, this.game.players)?.role?.onKilled()
            : this.game.bot.sendMessage(this.game.chatId,
            'Не удалось придти к одному решению! Расстроенная толпа расходится по домам...')
    }
}

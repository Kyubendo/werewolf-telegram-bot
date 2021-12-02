import {RoleBase} from "../index";
import {Player} from "../../Player/Player";
import {DeathType} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {playerLink} from "../../Utils/playerLink";
import {findPlayer} from "../../Game/findPlayer";
import {timer, Timer} from "../../Utils/Timer";

export class Cowboy extends RoleBase {
    readonly roleName = 'Ковбой 🤠'

    startMessageText = () => 'Ты никогда не расстаёшься со своим кольтом, и если ты умрешь, у тебя будет шанс ' +
        'забрать кого-то с собой на тот свет.'

    weight = () => 4.5
    deathTimer?: Timer
    killMessage = () => ({
        text: {
            toChat: (deadPlayer: Player) => `${playerLink(this.player)} истек большим количеством крови и уже `
                + `лежит на земле умирая... Но успевает вытянуть оружие и выстрелить ${playerLink(deadPlayer)}, `
                + `прямо в голову. ${playerLink(deadPlayer, true)} умирает.`,
            toTarget: 'Откуда ни возьмись, тебе в лоб влетает пуля.',
        },
        gif: 'https://media.giphy.com/media/3N2ML3tw4c4uc/giphy.gif', // https://media.giphy.com/media/7OXlwjJGmMjSI9Dfpn/giphy.gif
    })

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if (!await super.handleDeath(killer, type)) return false
        if (!Cowboy.game.players.find(p => p.isAlive)) return true
        Cowboy.game.stopStage()
        this.deathTimer = timer(this.handleChoice, 10_000)
        await Cowboy.game.bot.sendMessage(
            this.player.id,
            'Ты умираешь... Но у тебя ещё есть немного времени, чтобы достать свой кольт!'
            + '\nВ кого ты хочешь пальнуть напоследок?',
            {
                reply_markup: generateInlineKeyboard(
                    Cowboy.game.players.filter(p => p.isAlive)
                )
            }
        ).then(msg => this.actionMsgId = msg.message_id)
        return true
    }

    handleChoice = async (choice?: string) => {
        this.deathTimer?.stop()
        const targetPlayer = findPlayer(choice, Cowboy.game.players)
        await targetPlayer?.role?.onKilled(this.player)
        await this.choiceMsgEditText(targetPlayer);
        if (!(targetPlayer?.role instanceof Cowboy)) Cowboy.game.setNextStage();
    }
}
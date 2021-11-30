import {RoleBase} from "../index";
import {Player} from "../../Player/Player";
import {DeathType} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {playerLink, playerLinkWithRole} from "../../Utils/playerLink";
import {findPlayer} from "../../Game/findPlayer";

export class Cowboy extends RoleBase {
    readonly roleName = 'Ковбой 🤠'

    startMessageText = () => 'Ты корова-мальчик.'

    weight = () => 4.5

    killMessage = () => ({
        text: {
            toChat: (deadPlayer: Player) => `${playerLink(this.player)} истек большим количеством крови и уже `
                + `лежит на земле умирая... Но успевает вытянуть оружие и выстрелить в ${playerLink(deadPlayer)}, `
                + `который(ая) получает пулю прямо в лобешник. ${playerLinkWithRole(deadPlayer)} умирает.`,
            toTarget: 'Откуда ни возьмись, тебе в лоб влетает пуля.',
        },
        gif: 'https://media.giphy.com/media/3N2ML3tw4c4uc/giphy.gif', // https://media.giphy.com/media/7OXlwjJGmMjSI9Dfpn/giphy.gif
    })

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        Cowboy.game.stageTimer?.stop() // ZA WARUDO!!!

        await Cowboy.game.bot.sendMessage(
            this.player.id,
            'В кого ты хочешь выстрелить?',
            {
                reply_markup: generateInlineKeyboard(
                    Cowboy.game.players.filter(player => player !== this.player && player.isAlive)
                )
            }
        ).then(msg => this.actionMsgId = msg.message_id)
        return super.handleDeath(killer, type);
    }

    handleChoice = async (choice?: string) => {
        const targetPLayer = findPlayer(choice, Cowboy.game.players)
        await targetPLayer?.role?.onKilled(this.player)
        await this.choiceMsgEditText();
        Cowboy.game.setNextStage();
    }
}
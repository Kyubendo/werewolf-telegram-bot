import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {Player} from "../../Player/Player";

export class Martyr extends RoleBase {
    readonly roleName = 'Мученица 📿';

    startMessageText = () => `Ты ${this.roleName}.`
    weight = () => 0;

    targetHandleDeath?: (killer?: Player) => boolean

    action = () => {
        Martyr.game.bot.sendMessage(
            this.player.id,
            'За кого ты хочешь умереть?',
            {
                reply_markup: generateInlineKeyboard(Martyr.game.players.filter(player => player !== this.player &&
                    player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }


    handleChoice = () => {
        if (!this.targetPlayer) return
        this.targetPlayer
    }
}
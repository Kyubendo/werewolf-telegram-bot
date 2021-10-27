import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";

export class Martyr extends RoleBase {
    readonly roleName = 'Мученица 📿';

    startMessageText = () => `Ты ${this.roleName}.`
    weight = () => 0;

    action = () => {
        if (this.targetPlayer?.role) {
            this.targetPlayer.role.handleDeath = this.targetPlayer.role.originalHandleDeath
            return
        }
        Martyr.game.bot.sendMessage(
            this.player.id,
            'За кого ты хочешь умереть?',
            {
                reply_markup: generateInlineKeyboard(Martyr.game.players.filter(player => player !== this.player &&
                    player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;
        this.targetPlayer.role.handleDeath = (killer) => {
            this.onKilled(this.player)
                // messages
            return false
        }
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Martyr.game.players);
        this.choiceMsgEditText();
    }
}
import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {Pumpkin} from "../Others/Pumpkin";

export class JackOLantern extends RoleBase {
    roleName = 'Jack-O-Lantern 🎃';
    startMessageText = () => 'Поздравляю с Хэллоуином! Превращай остальный игроков в тыквы и побеждай в одиночку. ' +
        'Испорти всем остальным праздник!';
    weight = () => -6;


    action = () => {
        this.targetPlayer = undefined;

        JackOLantern.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь превратить в тыкву?',
            {
                reply_markup: generateInlineKeyboard(
                    JackOLantern.game.players.filter(player => player !== this.player && player.isAlive)
                )
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer) return;

        this.targetRole = this.targetPlayer.role;
        this.targetPlayer.role = new Pumpkin(this.targetPlayer, this.targetPlayer.role)
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, JackOLantern.game.players);
        this.choiceMsgEditText();
    }
}
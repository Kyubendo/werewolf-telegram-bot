import {RoleBase} from "../index";
import {Player} from "../../Game";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Cupid extends RoleBase {
    readonly roleName = 'Купидон 🏹';

    readonly startMessageText = () => "Свяжи голубков.";

    readonly weight = () => 2;

    targetPlayer2?: Player

    action = () => {
        this.targetPlayer = undefined;
        this.targetPlayer2 = undefined;
        this.loveArrowChoice()
    }

    loveArrowChoice = () => Cupid.game.bot.sendMessage(
        this.player.id,
        'Кого ты хочешь связать узами вечной любви?',
        {
            reply_markup: generateInlineKeyboard(
                Cupid.game.players.filter(player => player !== this.targetPlayer && player.isAlive)
            )
        }
    ).then(msg => this.choiceMsgId = msg.message_id)

    handleChoice = (choice?: string) => {
        if (this.targetPlayer) {
            this.targetPlayer2 = findPlayer(choice, Cupid.game.players);
            if (!this.targetPlayer2) return // handle
            RoleBase.game.bot.editMessageText(
                `Выбор принят — ${highlightPlayer(this.targetPlayer2)}.`,
                {message_id: this.choiceMsgId, chat_id: this.player.id}
            )
        } else {
            this.targetPlayer = findPlayer(choice, Cupid.game.players)
            if (!this.targetPlayer) return // handle
            this.choiceMsgEditText().then(this.loveArrowChoice)
        }
    }
}

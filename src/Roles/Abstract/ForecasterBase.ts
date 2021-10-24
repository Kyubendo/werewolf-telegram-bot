import {generateInlineKeyboard} from "../../Game/playersButtons";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RoleBase} from "./RoleBase";
import {findPlayer} from "../../Game/findPlayer";

export abstract class ForecasterBase extends RoleBase {
    action = () => {
        if (ForecasterBase.game.stage !== 'night') return;
        ForecasterBase.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь посмотреть?',
            {
                reply_markup: generateInlineKeyboard(ForecasterBase.game.players
                    .filter(player => player !== this.player && player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (ForecasterBase.game.stage !== 'night' || !this.targetPlayer?.role) return;
        let roleName = this.forecastRoleName(this.targetPlayer.role);

        ForecasterBase.game.bot.sendMessage(
            this.player.id,
            `Ты видишь, что ${highlightPlayer(this.targetPlayer)} *${roleName}*!`
        )
        this.targetPlayer = undefined
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, ForecasterBase.game.players)
        this.choiceMsgEditText();
    }


    abstract forecastRoleName:(targetRole: RoleBase) => string;
}
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {playerLink} from "../../Utils/playerLink";
import {findPlayer} from "../../Game/findPlayer";
import {RoleBase} from "../index";

export abstract class ForecasterBase extends RoleBase {
    action = () => {
        ForecasterBase.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь посмотреть?',
            {
                reply_markup: generateInlineKeyboard(ForecasterBase.game.players
                    .filter(player => player !== this.player && player.isAlive))
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResult = async () => {
        if (!this.targetPlayer?.role) return;
        let roleName = this.forecastRoleName(this.targetPlayer.role);

        await ForecasterBase.game.bot.sendMessage(
            this.player.id,
            `Ты видишь, что ${playerLink(this.targetPlayer)} ${roleName}`
        )
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, ForecasterBase.game.players);
        this.choiceMsgEditText();
    }

    abstract forecastRoleName:(targetRole: RoleBase) => string | undefined;
}
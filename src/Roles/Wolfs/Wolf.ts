import {playersButtons} from "../../Game/playersButtons";
import {Player} from "../../Player/Player";
import {findPlayer} from "../../Game/findPlayer";
import {RoleBase} from "../RoleBase";

export class Wolf extends RoleBase {
    roleName = 'Wolf';
    startMessageText = 'Ты волк. Скушай всё село.';
    weight = () => -10;

    killMessage = (deadPlayer: Player) => {
        Wolf.bot.sendMessage(Wolf.game.chatId, `НомномНОМномНОМНОМном... ${deadPlayer.name} съели заживо!
${deadPlayer.name} был(а) ${deadPlayer.role?.roleName}.`)
    }

    action = () => {
        if (Wolf.game.stage !== 'night') return;
        Wolf.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь съесть?',
            {
                reply_markup: playersButtons(Wolf.game.players, true,
                    ...Wolf.game.players.filter(wolf => wolf.role instanceof Wolf))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (Wolf.game.stage !== 'night' || !this.targetPlayer) return;
        this.targetPlayer.role?.handleDeath(this.player);
        this.targetPlayer = undefined
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Wolf.game.players);
        this.choiceMsgEditText();
    }
}

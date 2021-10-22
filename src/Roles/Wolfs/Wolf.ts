import {generateInlineKeyboard, playersButtons} from "../../Game/playersButtons";
import {Player} from "../../Player/Player";
import {findPlayer} from "../../Game/findPlayer";
import {RoleBase} from "../RoleBase";
import {alliesMessage} from "../../Game/findAllies";

export class Wolf extends RoleBase {
    roleName = 'Волк 🐺';
    startMessageText = 'Ты волк. Скушай всё село.' + alliesMessage(this.player);
    weight = () => -10;

    killMessage = (deadPlayer: Player) => `НомномНОМномНОМНОМном... ${deadPlayer.name} съели заживо!` +
        `\n${deadPlayer.name} был(а) ${deadPlayer.role?.roleName}.`

    action = () => {
        if (Wolf.game.stage !== 'night') return;
        Wolf.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь съесть?',
            {
                reply_markup: generateInlineKeyboard(
                    Wolf.game.players.filter(player => !(player.role instanceof Wolf) && player.isAlive)
                )
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

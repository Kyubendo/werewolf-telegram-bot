import {generateInlineKeyboard} from "../../Game/playersButtons";
import {Player} from "../../Player/Player";
import {findPlayer} from "../../Game/findPlayer";
import {RoleBase} from "../RoleBase";
import {alliesMessage} from "../../Game/findAllies";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Traitor} from "../Villagers/Traitor";

export class Wolf extends RoleBase {
    roleName = 'Волк 🐺';
    startMessageText = `Ты ${this.roleName}. Скушай всё село.` + alliesMessage(this.player);
    weight = () => -10;

    killMessageAll = (deadPlayer: Player) => `НомномНОМномНОМНОМном... ${highlightPlayer(deadPlayer)} съели заживо!` +
        `\n${highlightPlayer(deadPlayer)} был(а) ${deadPlayer.role?.roleName}.`
    killMessageDead = 'О нет! Ты съеден(а) волком!';

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
        this.targetPlayer.role?.onKilled(this.player);
        this.targetPlayer = undefined
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Wolf.game.players);
        this.choiceMsgEditText();
    }

    handleDeath(killer?: Player): boolean {
        const traitor = Wolf.game.players.find(player => player.role instanceof Traitor);
        if (!(Wolf.game.players.filter(player => player.role instanceof Wolf).length - 1) && traitor) {
            traitor.role = new Wolf(traitor);
            traitor.role.previousRole = new Traitor(traitor);
            Wolf.game.bot.sendMessage(
                traitor.id,
                `Твое время настало, ты обрел новый облик, ${traitor.role.previousRole?.roleName}! ` +
                `Теперь ты ${traitor.role.roleName}!`
            )
        }
        return super.handleDeath(killer);
    }
}

import {Villager} from "./Villager";
import {Lycan} from "../Wolfs/Lycan";
import {RoleBase} from "../RoleBase";
import {Wolf} from "../Wolfs/Wolf";
import {WoodMan} from "./WoodMan";
import {Traitor} from "./Traitor";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";


export class Seer extends Villager {
    roleName = 'Провидец 👳';
    startMessageText = `Ты ${this.roleName} Каждую ночь ты можешь выбрать человека, чтобы "увидеть" его роль.`;
    weight = () => 7;

    action = () => {
        if (Seer.game.stage !== 'night') return;
        Seer.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь посмотреть?',
            {
                reply_markup: generateInlineKeyboard(Seer.game.players.filter(player => player !== this.player &&
                player.isAlive), true)
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    };

    actionResolve = () => {
        if (Seer.game.stage !== 'night' || !this.targetPlayer?.role) return;
        let roleName = this.forecastRoleName(this.targetPlayer.role);

        Seer.game.bot.sendMessage(
            this.player.id,
            `Ты видишь, что ${this.targetPlayer.name} это ${roleName}!`
        )
        this.targetPlayer = undefined
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Seer.game.players)
        this.choiceMsgEditText();
    }

    forecastRoleName = (targetRole: RoleBase) => {
        if (targetRole instanceof Lycan) {
            return new Villager(this.player).roleName; // Seer sees Lycan as Villager
        } else if (targetRole instanceof Wolf || targetRole instanceof WoodMan) {
            return new Wolf(this.player).roleName; // Seer sees all wolves and WoodMan as Wolf
        } else if (targetRole instanceof Traitor) {
            return Math.random() >= 0.5 ? new Wolf(this.player).roleName : new Villager(this.player).roleName;
            // Seer sees Traitor with random chance - 50% as Wolf and 50% as Villager
        }
        return targetRole.roleName;
    }
}

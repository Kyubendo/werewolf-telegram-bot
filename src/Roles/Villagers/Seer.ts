import {Villager} from "./Villager";
import {Lycan} from "../Wolves/Lycan";
import {RoleBase} from "../RoleBase";
import {Wolf} from "../Wolves/Wolf";
import {WoodMan} from "./WoodMan";
import {Traitor} from "./Traitor";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Player} from "../../Player/Player";
import {ApprenticeSeer} from "./ApprenticeSeer";


export class Seer extends Villager {
    roleName = 'Провидец 👳';
    startMessageText = () => `Ты ${this.roleName} Каждую ночь ты можешь выбрать человека, чтобы "увидеть" его роль.`;
    weight = () => 7;

    action = () => {
        if (Seer.game.stage !== 'night') return;
        Seer.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь посмотреть?',
            {
                reply_markup: generateInlineKeyboard(Seer.game.players.filter(player => player !== this.player &&
                    player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (Seer.game.stage !== 'night' || !this.targetPlayer?.role) return;
        let roleName = this.forecastRoleName(this.targetPlayer.role);

        Seer.game.bot.sendMessage(
            this.player.id,
            `Ты видишь, что ${highlightPlayer(this.targetPlayer)} ${roleName}`
        )
        this.targetPlayer = undefined
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Seer.game.players)
        this.choiceMsgEditText();
    }

    handleDeath(killer?: Player): boolean {
        const apprenticeSeerPlayer = Seer.game.players.find(player => player.role instanceof ApprenticeSeer);
        if (apprenticeSeerPlayer) {
            const previousRole = apprenticeSeerPlayer.role;
            apprenticeSeerPlayer.role = new Seer(apprenticeSeerPlayer);
            apprenticeSeerPlayer.role.previousRole = previousRole;
            Seer.game.bot.sendMessage(
                apprenticeSeerPlayer.id,
                `${highlightPlayer(this.player)} был ${apprenticeSeerPlayer.role.roleName}. ` +
                `Ты занял его место по случаю его смерти.`
            )
        }

        Seer.game.bot.sendMessage(
            Seer.game.chatId,
            `Селяне осматривают расчленённые останки ${highlightPlayer(this.player)} со множеством ` +
            'колотых ран. Удивительно, но мозг был аккуратно вырезан, будто хотели сказать, что селяне потеряли ' +
            `лучшие мозги. *${this.roleName}* — ${highlightPlayer(this.player)} мертв.`)
        this.player.isAlive = false;
        return true;
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
        return `это *${targetRole.roleName}*!`;
    }
}

import {Villager} from "./Villager";
import {Lycan} from "../WolfTeam/Lycan";
import {DeathType} from "../../Game";
import {RoleBase} from "../"
import {Wolf} from "../WolfTeam/Wolf";
import {WoodMan} from "./WoodMan";
import {Traitor} from "./Traitor";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Player} from "../../Player/Player";
import {ApprenticeSeer} from "./ApprenticeSeer";
import {ForecasterBase} from "../Abstract/ForecasterBase";
import {SerialKiller} from "../Others/SerialKiller";
import {findPlayer} from "../../Game/findPlayer";
import {Beholder} from "../index";


export class Seer extends ForecasterBase {
    roleName = 'Провидец 👳';
    roleIntroductionText = () => 'Ты Провидец 👳!';
    startMessageText = () => `Каждую ночь ты можешь выбрать человека, чтобы "увидеть" его роль.`;
    weight = () => 6.5;

    nightActionDone = false

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        const apprenticeSeerPlayers = Seer.game.players
            .filter(player => player.role instanceof ApprenticeSeer && player.isAlive);
        if (apprenticeSeerPlayers.length) {
            apprenticeSeerPlayers.forEach(apprenticeSeerPlayer => {
                if (apprenticeSeerPlayer) {
                    apprenticeSeerPlayer.role = new Seer(apprenticeSeerPlayer, apprenticeSeerPlayer.role);
                    Seer.game.bot.sendMessage(
                        apprenticeSeerPlayer.id,
                        `${highlightPlayer(this.player)} был ${apprenticeSeerPlayer.role.roleName}. ` +
                        `Ты занял его место по случаю его смерти.`
                    )
                }
            })

            const beholderPlayers = Seer.game.players
                .filter(player => player.role instanceof Beholder && player.isAlive)
            beholderPlayers.forEach(beholderPlayer => {
                Seer.game.bot.sendMessage(
                    beholderPlayer.id,
                    `Провидец ${highlightPlayer(this.player)} мёртв. ` + (
                        apprenticeSeerPlayers.length === 1
                            ? `На его место встал ${highlightPlayer(apprenticeSeerPlayers[0])}.`
                            : 'Но не огорчайся, ведь теперь сразу несколько игроков стали провидцами: ' +
                            apprenticeSeerPlayers.join(', ')
                    )
                )
            })
        }


        if (killer?.role && !type) {
            await Seer.game.bot.sendMessage(
                Seer.game.chatId,
                killer?.role instanceof SerialKiller
                    ? `Селяне осматривают расчленённые останки ${highlightPlayer(this.player)} со множеством ` +
                    'колотых ран. Удивительно, но мозг был аккуратно вырезан, будто хотели сказать, что селяне потеряли ' +
                    `лучшие мозги. *${this.roleName}* ${highlightPlayer(this.player)} мертв.`
                    : 'День начался с печальных новостей... ' +
                    `Всем известный *${this.roleName}* мертв! Покойся с миром ${highlightPlayer(this.player)}...`
            )

            killer.role.killMessage && await Seer.game.bot.sendAnimation(
                this.player.id,
                killer.role.killMessage().gif,
                {
                    caption: killer.role.killMessage().text.toTarget
                }
            )
        } else
            return super.handleDeath(killer, type);

        this.player.isAlive = false;
        return true;
    }

    seerSees = (role: RoleBase): string => {
        if (role instanceof Lycan)
            return new Villager(this.player).roleName;
        else if (role instanceof Wolf || role instanceof WoodMan)
            return new Wolf(this.player).roleName;
        else if (role instanceof Traitor)
            return Math.random() >= 0.5 ? new Wolf(this.player).roleName : new Villager(this.player).roleName;
        else return role.roleName
    }

    forecastRoleName = (targetRole: RoleBase) => `это *${this.seerSees(targetRole)}*!`

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, ForecasterBase.game.players)
        this.choiceMsgEditText();
        this.doneNightAction()
    }
}

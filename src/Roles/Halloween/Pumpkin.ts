import {Player, DeathType} from "../../Game";
import {RoleBase, JackOLantern} from "../"
import {playerLink} from "../../Utils/playerLink";

export class Pumpkin extends RoleBase {
    roleName = 'Тыква 🎃';
    startMessageText = () => 'Ты проиграл!';
    weight = () => 0;

    actionResolve = async () => {
        if (Math.random() >= 0.25) {
            const specialCondition = this.player.role?.specialCondition;
            this.player.role = this.previousRole?.createThisRole(this.player, this.player.role);
            if (this.player.role)
                this.player.role.specialCondition = specialCondition;

            Pumpkin.game.bot.sendMessage(
                this.player.id,
                `Наконец-то этот кошмар закончился! Теперь ты снова ${this.player.role?.roleName}.`
            )
        } else {
            this.player.role = new JackOLantern(this.player, this.player.role);
            Pumpkin.game.bot.sendMessage(
                this.player.id,
                `Прошли уже сутки, а ты всё ещё тыква... ` +
                `Ты понимаешь, что теперь ты останешься таким навсегда. ` +
                `Ты берёшь стоящий рядом фонарь и отправляешься терроризировать жителей деревни. ` +
                `Теперь ты сам ${this.player.role.roleName}!`
            )
        }
    }

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if (!killer) {
            Pumpkin.game.bot.sendAnimation(
                Pumpkin.game.chatId,
                'https://media.giphy.com/media/Z4Sek3StLGVO0/giphy.gif',
                {
                    caption: `Как только петля затягивается на шее ${playerLink(this.player)}, ` +
                        `его голова падает на землю и вы видите, что это... ${this.roleName}! ` +
                        `Он поднимает её и ставит на место. ` +
                        `Под удивлённые взгляды наблюдающих он возвращается домой целый и невредимый.`
                }
            )
            return false;
        }
        return super.handleDeath(killer, type);
    }
}
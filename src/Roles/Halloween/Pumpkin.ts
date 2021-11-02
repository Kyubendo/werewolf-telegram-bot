import {Player, RoleBase} from "../../Game";
import {DeathType} from "../../Game";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {JackOLantern} from "../index";

export class Pumpkin extends RoleBase {
    roleName = 'Тыква 🎃';
    startMessageText = () => 'Ты проиграл!';
    weight = () => 0;

    actionResolve = () => {
        if (Math.random() >= 0.25) {
            this.player.role = this.previousRole?.createThisRole(this.player, this.player.role);
            Pumpkin.game.bot.sendMessage(
                this.player.id,
                `Наконец-то этот кошмар закончился! Теперь ты снова ${this.player.role?.roleName}`
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

    handleDeath(killer?: Player, type?: DeathType): boolean {
        if (!killer) {
            Pumpkin.game.bot.sendAnimation(
                Pumpkin.game.chatId,
                'https://media.giphy.com/media/Z4Sek3StLGVO0/giphy.gif',
                {
                    caption: `Как только петля затягивается на шее ${highlightPlayer(this.player)}, ` +
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
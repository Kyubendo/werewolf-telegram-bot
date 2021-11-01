import {Player, RoleBase} from "../../Game";
import {DeathType} from "../Abstract/RoleBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {JackOLantern} from "../Villagers/JackOLanther";

export class Pumpkin extends RoleBase {
    roleName = 'Тыква 🎃';
    roleIntroductionText = () => `Ты ${this.roleName}...\n`
    startMessageText = () => 'Ты проиграл!';
    weight = () => 0;

    actionResolve = () => {
        //if (Pumpkin.game.stage !== 'lynch') return

        console.log('тыква')
        if (Math.random() >= 0.25)
            this.player.role = this.previousRole?.createThisRole(this.player, this.player.role);
        else
            this.player.role = new JackOLantern(this.player, this.player.role);
        console.log(this.player.role?.roleName)
    }

    originalHandleDeath = (killer?: Player, type?: DeathType): boolean => {
        console.log('pumpkin - handleDeath ' + this.player.role?.roleName)
        if (!killer) {
            Pumpkin.game.bot.sendAnimation(
                Pumpkin.game.chatId,
                'https://media.giphy.com/media/Z4Sek3StLGVO0/giphy.gif',
                {
                    caption: `Как только петля оказывается на шее ${highlightPlayer(this.player)}, ` +
                        `его голова падает на землю и вы видите, что это... ${this.roleName}! ` +
                        `Он поднимает её и ставит на место. ` +
                        `Под удивлённые взгляды наблюдающих он возвращается домой целый и невредимый.`
                }
            )
            return false;
        }
        return this.defaultHandleDeath(killer, type);
    }
}
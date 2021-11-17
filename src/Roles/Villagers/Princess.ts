import {RoleBase} from "../Abstract/RoleBase";
import {specialConditionPrincess} from "../../Utils/specialConditionTypes";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Monarch} from "../index";

export class Princess extends RoleBase {
    roleName = 'Принцесса 💍';
    roleIntroductionText = () => `Ты скрывающаяся ${this.roleName}, `
    startMessageText = () => 'сбежавшая от своей скучной, изнеженной жизни, чтобы провести день среди деревенщин. '
        + 'Если они попытаются казнить тебя, они совершат огромную ошибку, и никто не будет казнен.'
    weight = () => 2;
    specialCondition: specialConditionPrincess = {ringShowed: false}

    handleDeath(killer?: Player): boolean {
        const monarchWill = Princess.game.players
            .find(p => p.role instanceof Monarch && p.role.specialCondition.comingOut)
        if (!killer && !this.specialCondition.ringShowed && !monarchWill) {
            Princess.game.bot.sendAnimation(
                Princess.game.chatId,
                'https://media.giphy.com/media/RLVHPJJv7jY1q/giphy.gif',
                {
                    caption: `Как только селяне решили казнить ${highlightPlayer(this.player)}, она воскликнула `
                        + `“Постойте! Я Принцесса! Это королевское кольцо, эта печать короля все подтверждают! `
                        + `Каждую ночь я в окружении слуг, так что я не могу быть злой!” `
                        + `Почувствовав себя глупо, смущенные жители разошлись спать.`
                })
            this.specialCondition.ringShowed = true;
            return false;
        }
        return super.handleDeath(killer);
    }
}
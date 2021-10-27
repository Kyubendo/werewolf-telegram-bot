import {Gunner} from "./Gunner";
import {SerialKiller} from "../Others/SerialKiller";
import {Wolf} from "../Wolves and their allies/Wolf";
import {ForecasterBase} from "../Abstract/ForecasterBase";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RoleBase} from "../Abstract/RoleBase";

export class WiseElder extends ForecasterBase {
    roleName = "Мудрец 📚";
    startMessageText = () => `На своем долгом жизненном ` +
        'пути ты повстречал очень много разных людей, плохих и хороших. С этими знаниями тебе хватит лишь взгляда, ' +
        'чтобы определить, может другой человек убивать или нет. Проверить ты можешь только один раз за день.'
    weight = () => 5;

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;
        let roleName = this.forecastRoleName(this.targetPlayer.role);

        ForecasterBase.game.bot.sendMessage(
            this.player.id,
            `Ты видишь, что ${highlightPlayer(this.targetPlayer)} ${roleName}.`
        )
        this.targetPlayer = undefined
    }

    forecastRoleName = (targetRole: RoleBase) => { // Arsonist, CultistHunter, FallenAngel, Hunter, BlackWolf?
        const killers = [Gunner, SerialKiller, Wolf];
        return killers.find(player => targetRole instanceof player)
            ? 'может убивать'
            : 'совершенно безобидный человек и не желает никому причинять боль'
    }
}
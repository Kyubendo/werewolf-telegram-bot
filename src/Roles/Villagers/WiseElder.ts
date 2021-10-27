import {Gunner} from "./Gunner";
import {SerialKiller} from "../Others/SerialKiller";
import {Wolf} from "../WolfTeam/Wolf";
import {ForecasterBase} from "../Abstract/ForecasterBase";
import {RoleBase} from "../Abstract/RoleBase";
import {GameStage} from "../../Game/Game";

export class WiseElder extends ForecasterBase {
    roleName = "Мудрец 📚";
    startMessageText = () => `На своем долгом жизненном ` +
        'пути ты повстречал очень много разных людей, плохих и хороших. С этими знаниями тебе хватит лишь взгляда, ' +
        'чтобы определить, может другой человек убивать или нет. Проверить ты можешь только один раз за день.'
    weight = () => 5;

    forecastGameStage: GameStage = 'day';

    forecastRoleName = (targetRole: RoleBase) => { // Arsonist, CultistHunter, FallenAngel, Hunter, BlackWolf?
        const killers = [Gunner, SerialKiller, Wolf];
        return (killers.find(player => targetRole instanceof player)
            ? 'может убивать'
            : 'совершенно безобидный человек и не желает никому причинять боль') + '.'
    }
}
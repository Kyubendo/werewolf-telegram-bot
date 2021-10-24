import {Seer} from "./Seer";
import {Gunner} from "./Gunner";
import {SerialKiller} from "../Others/SerialKiller";
import {Wolf} from "../Wolves/Wolf";

export class WiseElder extends Seer {
    roleName = "Мудрец 📚";
    startMessageText = () => `Ты ${this.roleName}! На своем долгом жизненном ` +
        'пути ты повстречал очень много разных людей, плохих и хороших. С этими знаниями тебе хватит лишь взгляда, ' +
        'чтобы определить, может другой человек убивать или нет. Проверить ты можешь только один раз за день.'
    weight = () => 5;

    forecastRoleName = () => this.targetPlayer?.role instanceof Gunner // Arsonist, CultistHunter, FallenAngel, Hunter, BlackWolf?
        || this.targetPlayer?.role instanceof SerialKiller
        || this.targetPlayer?.role instanceof Wolf
        ? 'может убивать.'
        : 'совершенно безобидный человек и не желает никому причинять боль.'
}
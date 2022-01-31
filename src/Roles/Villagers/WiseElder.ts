import {Arsonist, Cowboy, ForecasterBase, Gunner, RoleBase, SerialKiller, Wolf} from "../";

export class WiseElder extends ForecasterBase {
    roleName = "Мудрец 📚";
    startMessageText = () => `На своем долгом жизненном ` +
        'пути ты повстречал очень много разных людей, плохих и хороших. С этими знаниями тебе хватит лишь взгляда, ' +
        'чтобы определить, может другой человек убивать или нет. Проверить ты можешь только один раз за день.'

    forecastRoleName = (targetRole: RoleBase) => { // CultistHunter, FallenAngel, BlackWolf?
        const killers = [Gunner, SerialKiller, Wolf, Arsonist, Cowboy]; // move to different file, unite with checkEndGame logic
        return killers.find(killer => targetRole instanceof killer)
            ? 'может убивать.'
            : 'совершенно безобидный человек и не желает никому причинять боль.';
    }
}
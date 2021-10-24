import {Villager} from "./Villager";

export class ApprenticeSeer extends Villager {
    roleName = 'Ученик провидца 🙇‍♂';
    startMessageText = `Сейчас ты обычный селянин. Однако если Провидец умрет, ты займешь его место, ` +
        `ведь ты ${this.roleName}!`;
    weight = () => 6;
}
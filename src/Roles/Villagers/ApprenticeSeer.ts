import {RoleBase} from "../Abstract/RoleBase";

export class ApprenticeSeer extends RoleBase {
    roleName = 'Ученик провидца 🙇‍♂';
    roleIntroductionMessage = () => 'Сейчас ты обычный селянин. Однако если Провидец умрет, ты займешь его место, ' +
        `ведь ты ${this.roleName}! `;
    startMessageText = () => 'Учись и жди своего часа!'
    weight = () => 6;
}
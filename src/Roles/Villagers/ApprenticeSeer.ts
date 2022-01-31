import {RoleBase} from "../";

export class ApprenticeSeer extends RoleBase {
    roleName = 'Ученик провидца 🙇‍♂';
    roleIntroductionText = () => ''
    startMessageText = () =>`Сейчас ты обычный селянин. Однако если Провидец умрет, ты займешь его место, ` +
        `ведь ты ${this.roleName}!`;
}
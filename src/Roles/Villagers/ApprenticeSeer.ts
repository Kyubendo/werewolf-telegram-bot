import {RoleBase} from "../Abstract/RoleBase";

export class ApprenticeSeer extends RoleBase {
    roleName = 'Ученик провидца 🙇‍♂';
    roleIntroductionText = () => ''
    startMessageText = () =>`Сейчас ты обычный селянин. Однако если Провидец умрет, ты займешь его место, ` +
        `ведь ты ${this.roleName}!`;
    weight = () => 5.5;
}
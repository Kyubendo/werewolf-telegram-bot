import {RoleBase} from "../Abstract/RoleBase";

export class ApprenticeSeer extends RoleBase {
    roleName = 'Ученик провидца 🙇‍♂';
    startMessageText = () =>`Сейчас ты обычный селянин. Однако если Провидец умрет, ты займешь его место, ` +
        `ведь ты ${this.roleName}!`;
    weight = () => 6;
}
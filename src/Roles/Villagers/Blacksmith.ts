import {RoleBase} from "../Abstract/RoleBase";

export class Blacksmith extends RoleBase {
    roleName = 'Кузнец ⚒';
    roleIntroductionText = () => `Ты ${this.roleName} `;
    startMessageText = () => '- ремесленник по металлу этой деревни. ' +
        'Ты имеешь немного, но достаточно серебра, ' +
        'чтобы предотвратить волчью атаку только на одну ночь. ' +
        'Днем ты можешь растолочь и распылить его по всей деревне. ' +
        'А в остальном ты простой селянин.'
    weight = () => 5;

    action = () => {

    }
}
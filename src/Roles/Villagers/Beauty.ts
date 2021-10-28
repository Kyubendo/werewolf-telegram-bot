import {RoleBase} from "../Abstract/RoleBase"; // Add Cultist Hunter, Cultist, Black Wolf?

export class Beauty extends RoleBase {
    roleName = 'Красавица 💅';
    startMessageText = () => `Ты ${this.roleName}, ` +
        'самая красивая и добрая селянка в этой деревне. Если какая-то ночная роль попытается навестить или ' +
        'убить тебя, вместо этого он(а) полюбит тебя за твою красоту и добрый взгляд, и вы станете возлюбленными.'
    weight = () => 3;
}
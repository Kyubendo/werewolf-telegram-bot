import {Villager} from "./Villager";

export class WolfMan extends Villager {
    roleName = 'Псарь 👱‍♂🌚'
    startMessageText = 'Ты скромный селянин - Псарь, но поскольку большую часть времени ты проводишь в лесу, ' +
        'где есть настоящие волки, провидец может запутаться и подумать, что вы волк! О, нет...'
    weight = () => -1;
}
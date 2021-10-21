import {Villager} from "./Villager";

export class WoodMan extends Villager {
    roleName = 'Лесник 🧔‍♂‍🌚'
    startMessageText = 'Ты скромный селянин - Лесник, но поскольку большую часть времени ты проводишь в лесу, ' +
        'где есть настоящие волки, провидец может запутаться и подумать, что вы волк! О, нет...'
    weight = () => -1;
}
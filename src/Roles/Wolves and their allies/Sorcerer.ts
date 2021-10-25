import {ForecasterBase} from "../Abstract/ForecasterBase";

export class Sorcerer extends ForecasterBase {
    roleName = 'Колдунья 🔮';
    startMessageText = () => `Ты ${this.roleName}  и обьединишься ты охотнее с детьми ночи, ` +
        'нежели с селянами. В ночь ты используешь свою силу, чтобы найти волков и провидца. Ты победишь лишь тогда, ' +
        'когда победят волки. Наслаждайся убийством несчастных сельских жителей.'
    weight = () => -2;

}
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RulerBase} from "../Abstract/RulerBase";

export class Monarch extends RulerBase {
    roleName = 'Монарх 🤴';
    startMessageText = () => 'Как у главы королевской семьи, у тебя есть власть в этой деревне... ' +
        'По крайней мере, на один день! ' +
        `Ты можешь показать деревне свою корону и семейное древо, и один день они позволят тебе ` +
        `вершить правосудие лично.`

    actionAnnouncement = () => ({
        message: `Пока жители деревни обсуждают ночные проишествия, ${highlightPlayer(this.player)} делает ` +
            `шаг вперед, предлагая всем внимательно посмотреть на корону, которую он прятал раньше.\n` +
            `Сегодня *${this.roleName}* решит, кого казнить.`,
        gif: 'https://media.giphy.com/media/okLCopqw6ElCDnIhuS/giphy.gif'
    })
}
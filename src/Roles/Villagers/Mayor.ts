import {RulerBase} from "../index";
import {playerLink} from "../../Utils/playerLink";

export class Mayor extends RulerBase {
    roleName = 'Мэр 🎖';
    startMessageText = () => 'Если ты разоблачишь себя, то твой голос во время казни начнёт оценивается вдвойне. ' +
        'Ты в команде селян.'

    actionAnnouncement = () => ({
        message: `${playerLink(this.player)} шагнул вперед и представил официальную печать мэра. ` +
            `Отныне голос, который отдал ${playerLink(this.player)} расценивается ` +
            `за два, ведь на его ленточке красуется надпись — ${this.roleName}.`,
        gif: 'https://media.giphy.com/media/xT5LMRnwpw5OGGBgiI/giphy.gif'
    })
}
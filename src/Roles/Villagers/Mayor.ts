import {RulerBase} from "../index";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Mayor extends RulerBase {
    roleName = 'Мэр 🎖';
    startMessageText = () => 'Если ты разоблачишь себя, то твой голос во время казни начнёт оценивается вдвойне. ' +
        'Ты в команде селян.'

    actionAnnouncement = () => ({
        message: `${highlightPlayer(this.player)} шагнул вперед и представил официальную печать мэра. ` +
            `Отныне голос, который отдал ${highlightPlayer(this.player)} расценивается ` +
            `за два, ведь на его ленточке красуется надпись — ${this.roleName}.`,
        gif: 'https://media.giphy.com/media/xT5LMRnwpw5OGGBgiI/giphy.gif'
    })
}
import {RoleBase} from "../Abstract/RoleBase";
import {specialConditionSnowman} from "../../Utils/specialConditionTypes";
import {findPlayer} from "../../Game/findPlayer";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {playerLink} from "../../Utils/playerLink";

export class Snowman extends RoleBase {
    roleName = 'Снеговик ☃';
    startMessageText = () => 'Несмотря на то, что тебя постоянно ломают дети, ты все равно помогаешь селянам. ' +
        'Ты можешь воспользоваться частями своего тела, ' +
        'чтобы сделать снежок и заморозить непонравившихся тебе жителей! ' +
        'Учти, что после третьего броска от тебя ничего не останется и ты умрёшь...';
    weight = () => 8;

    // actionAnnouncement = () => ({
    //     message: 'Вд, ' +
    //         `чтобы увидеть стоящего ${playerLink(this.player)} над ${playerLink(this.targetPlayer)}, и ` +
    //         'оружие все еще нацелено в голову...\n' +
    //         `${playerLink(this.targetPlayer)} был(а) *${this.targetPlayer.role?.roleName}*!`
    //     gif:
    // })

    specialCondition: specialConditionSnowman = {
        snowballs: 3
    }

    stealMessage = () => this.specialCondition.snowballs === 1
        ? `У тебя осталось ${this.specialCondition.snowballs} снежка. Учти, что если ты ви`
        `У тебя осталось ${this.specialCondition.snowballs} снежка. Учти, что если ты ви`

    action = () => {
        if (!this.specialCondition.snowballs || !this.targetPlayer) return;

        Snowman.game.bot.sendMessage(
            this.player.id,
            'В кого ты хочешь бросить снежок?',
            {
                reply_markup: generateInlineKeyboard(Snowman.game.players.filter(p => p !== this.player && p.isAlive))
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;

        this.targetPlayer.daysLeftToUnfreeze = 1;

        this.specialCondition.snowballs--;
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Snowman.game.players);
        this.choiceMsgEditText();
    }
}
import {DeathType, RoleBase} from "../../Game";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Player} from "../../Player/Player";
import {Gunner, SerialKiller, Wolf} from "../index";
import {randomElement} from "../../Utils/randomElement";
import {specialConditionMartyr} from "../../Utils/specialConditionTypes";

export class Martyr extends RoleBase {
    readonly roleName = 'Мученица 🕯';
    roleIntroductionText = () => `Ты ${this.roleName}. `
    startMessageText = () => 'В начале игры ты выбираешь человека, ' +
        'за которого умрешь. Если этот человек умрет, ты умрешь за него, ' +
        'и этот человек выживет. Пока ты не умрешь, ты в команде селян, ' +
        'но как только ты умерла за кого-то, ты можешь выиграть, ' +
        'только если этот человек выиграет.'
    weight = () => 0;

    protectedPlayerKiller?: Player
    diedForProtectedPlayer: boolean = false

    specialCondition: specialConditionMartyr = {
        protectedPlayer: undefined
    }
    nightActionDone = false

    action = () => {
        if (this.specialCondition.protectedPlayer?.role) {
            this.nightActionDone = true
            return
        }
        if (this.specialCondition.protectedPlayer?.role) return

        Martyr.game.bot.sendMessage(
            this.player.id,
            'За кого ты хочешь умереть?',
            {
                reply_markup: generateInlineKeyboard(
                    Martyr.game.players.filter(player => player !== this.player && player.isAlive), false
                )
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.specialCondition.protectedPlayer?.role) {
            this.specialCondition.protectedPlayer = randomElement(Martyr.game.players
                .filter(p => p !== this.player && p.isAlive))
            Martyr.game.bot.editMessageText(
                `Ты не успел сделать выбор, так что высшие силы сделали выбор ` +
                `за тебя — ${highlightPlayer(this.specialCondition.protectedPlayer)}`,
                {
                    chat_id: this.player.id,
                    message_id: this.choiceMsgId
                }
            )
        }
        if (!this.specialCondition.protectedPlayer.role) return
        this.specialCondition.protectedPlayer.role.handleDeath = (killer?: Player) => {
            if (!this.specialCondition.protectedPlayer) return false;

            this.protectedPlayerKiller = killer
            this.onKilled(this.player)
            this.diedForProtectedPlayer = true
            Martyr.game.bot.sendMessage(
                this.player.id,
                `Как только ${highlightPlayer(this.specialCondition.protectedPlayer)} оказался(лась) на грани жизни и смерти, `
                + `ты начинаешь молиться Древним Богам, чтобы они забрали тебя вместо него(нее). И они отвечают на `
                + `твои молитвы. Твоя жизнь будет отдана в жертву, но ${highlightPlayer(this.specialCondition.protectedPlayer)} будет жить.`
            )
            Martyr.game.bot.sendMessage(
                this.specialCondition.protectedPlayer?.id,
                `Ты проснулся(ась) в своем доме из-за того, что почувствовал(а) что-то... Ты помнишь, как `
                + `умирал(а), но что-то или кто-то спас тебя. Имя Мученицы ${highlightPlayer(this.player)} навсегда `
                + `отпечаталось у тебя в сознании. И ты знаешь, что она пожертвовала собой для того, чтобы ты жил(а).`
            )
            return false
        }
    }


    handleDeath(killer?: Player, type?: DeathType): boolean {
        if (killer === this.player && this.specialCondition.protectedPlayer) {

            let deathMessage: string | undefined
            if (!this.protectedPlayerKiller) deathMessage = `Жители решили казнить ${highlightPlayer(this.specialCondition.protectedPlayer)}, но внезапно яркая `
                + `вспышка света озарила площадь. Она была настолько ослепительна, что жители закрыли глаза. Когда все `
                + `закончилось, они увидели мертвое тело ${highlightPlayer(this.player)} на виселице, в то время как `
                + `${highlightPlayer(this.specialCondition.protectedPlayer)} стоит рядом как ни в чем не бывало.`
            else if (this.protectedPlayerKiller.role instanceof SerialKiller || this.protectedPlayerKiller.role instanceof Wolf) deathMessage = `Селяне собрались `
                + `на следующее утро и увидели лежащее на площади тело Мученицы ${highlightPlayer(this.player)}. `
                + `Вокруг нее были начертаны священные руны Древних Богов. Этой ночью *${this.roleName}* умерла за `
                + `другого человека.`
            else if (this.protectedPlayerKiller.role instanceof Gunner) deathMessage = `Вдруг раздался оглушительный выстрел, и все на площади `
                + `увидели, как *${this.protectedPlayerKiller.role.roleName}* ${highlightPlayer(this.protectedPlayerKiller)} все еще целится в голову `
                + `${highlightPlayer(this.specialCondition.protectedPlayer)}… Но промахивается и попадает в ${highlightPlayer(this.player)}, в `
                + `то время как ${highlightPlayer(this.specialCondition.protectedPlayer)} стоит абсолютно невредим(а).`
            // else if (killer.role instanceof Cowboy) deathMessage = `${killer.role.roleName} ${highlightPlayer(killer)} `
            //     + `второпях целится в ${highlightPlayer(this.specialCondition.protectedPlayer)} и стреляет в последний момент. Но попадает в `
            //     + `${highlightPlayer(this.player)}, в то время как ${highlightPlayer(this.specialCondition.protectedPlayer)} стоит целый(ая) `
            //     + `и невредимый(ая).`

            setTimeout(
                (deathMessage) => deathMessage && Martyr.game.bot
                    .sendMessage(Martyr.game.chatId, deathMessage),
                25,
                deathMessage
            )
            this.player.isAlive = false;
            return true;
        }
        return super.handleDeath(killer, type);
    }

    handleChoice = (choice?: string) => {
        this.specialCondition.protectedPlayer = findPlayer(choice, Martyr.game.players);
        this.choiceMsgEditText();
        if (this.specialCondition.protectedPlayer)
            this.stealMessage = `\nТы умрёшь за игрока ${highlightPlayer(this.specialCondition.protectedPlayer)}.`;
        this.doneNightAction();
    }

    choiceMsgEditText = () => {
        RoleBase.game.bot.editMessageText(
            `Выбор принят — ${this.specialCondition.protectedPlayer
                ? highlightPlayer(this.specialCondition.protectedPlayer)
                : 'Пропустить'}.`,
            {
                message_id: this.choiceMsgId,
                chat_id: this.player.id,
            }
        )
    }
}
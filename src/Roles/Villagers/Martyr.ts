import {DeathType, RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Player} from "../../Player/Player";
import {Gunner, SerialKiller, Wolf} from "../index";
import {randomElement} from "../../Utils/randomElement";

export class Martyr extends RoleBase {
    readonly roleName = 'Мученица 🕯';
    roleIntroductionText = () => `Ты ${this.roleName}. `
    startMessageText = () => 'В начале игры ты выбираешь человека, ' +
        'за которого умрешь. Если этот человек умрет, ты умрешь за него, ' +
        'и этот человек выживет. Пока ты не умрешь, ты в команде селян, ' +
        'но как только ты умерла за кого-то, ты можешь выиграть, ' +
        'только если этот человек выиграет.'
    weight = () => 6;

    nightActionDone = false

    targetKiller?: Player
    diedForTarget: boolean = false

    action = () => {
        if (this.targetPlayer?.role) return

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
        if (!this.targetPlayer?.role) {
            this.targetPlayer = randomElement(Martyr.game.players.filter(p => p !== this.player && p.isAlive))
            Martyr.game.bot.editMessageText(
                `Ты не успел сделать выбор, так что высшие силы сделали выбор ` +
                `за тебя — ${highlightPlayer(this.targetPlayer)}`,
                {
                    chat_id: this.player.id,
                    message_id: this.choiceMsgId
                }
            )
        }
        if (!this.targetPlayer.role) return
        this.targetPlayer.role.handleDeath = (killer) => {
            if (!this.targetPlayer) return false;

            this.targetKiller = killer
            this.onKilled(this.player)
            this.diedForTarget = true
            Martyr.game.bot.sendMessage(
                this.player.id,
                `Как только ${highlightPlayer(this.targetPlayer)} оказался(лась) на грани жизни и смерти, `
                + `ты начинаешь молиться Древним Богам, чтобы они забрали тебя вместо него(нее). И они отвечают на `
                + `твои молитвы. Твоя жизнь будет отдана в жертву, но ${highlightPlayer(this.targetPlayer)} будет жить.`
            )
            Martyr.game.bot.sendMessage(
                this.targetPlayer?.id,
                `Ты проснулся(ась) в своем доме из-за того, что почувствовал(а) что-то... Ты помнишь, как `
                + `умирал(а), но что-то или кто-то спас тебя. Имя Мученицы ${highlightPlayer(this.player)} навсегда `
                + `отпечаталось у тебя в сознании. И ты знаешь, что она пожертвовала собой для того, чтобы ты жил(а).`
            )
            return false
        }
    }

    originalHandleDeath = (killer?: Player, type?: DeathType): boolean => {
        console.log(this.targetPlayer?.name)
        if (killer === this.player && this.targetPlayer) {
            let deathMessage: string | undefined
            if (!this.targetKiller) deathMessage = `Жители решили казнить ${highlightPlayer(this.targetPlayer)}, но внезапно яркая `
                + `вспышка света озарила площадь. Она была настолько ослепительна, что жители закрыли глаза. Когда все `
                + `закончилось, они увидели мертвое тело ${highlightPlayer(this.player)} на виселице, в то время как `
                + `${highlightPlayer(this.targetPlayer)} стоит рядом как ни в чем не бывало.`
            else if (this.targetKiller.role instanceof SerialKiller || this.targetKiller.role instanceof Wolf) deathMessage = `Селяне собрались `
                + `на следующее утро и увидели лежащее на площади тело Мученицы ${highlightPlayer(this.player)}. `
                + `Вокруг нее были начертаны священные руны Древних Богов. Этой ночью *${this.roleName}* умерла за `
                + `другого человека.`
            else if (this.targetKiller.role instanceof Gunner) deathMessage = `Вдруг раздался оглушительный выстрел, и все на площади `
                + `увидели, как *${this.targetKiller.role.roleName}* ${highlightPlayer(this.targetKiller)} все еще целится в голову `
                + `${highlightPlayer(this.targetPlayer)}… Но промахивается и попадает в ${highlightPlayer(this.player)}, в `
                + `то время как ${highlightPlayer(this.targetPlayer)} стоит абсолютно невредим(а).`
            // else if (killer.role instanceof Cowboy) deathMessage = `${killer.role.roleName} ${highlightPlayer(killer)} `
            //     + `второпях целится в ${highlightPlayer(this.targetPlayer)} и стреляет в последний момент. Но попадает в `
            //     + `${highlightPlayer(this.player)}, в то время как ${highlightPlayer(this.targetPlayer)} стоит целый(ая) `
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
        return this.defaultHandleDeath(killer, type);
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Martyr.game.players);
        this.choiceMsgEditText();
        this.doneNightAction()
    }
}
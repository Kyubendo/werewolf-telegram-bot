import {DeathType, Player} from "../../Game";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {playerLink} from "../../Utils/playerLink";
import {Cowboy, Gunner, RoleBase, SerialKiller, Wolf} from "../index";
import {randomElement} from "../../Utils/randomElement";
import {specialConditionMartyr} from "../../Utils/specialConditionTypes";

export class Martyr extends RoleBase {
    readonly roleName = 'Мученица 🕯';
    roleIntroductionText = () => `Ты ${this.roleName}.`
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

    stealMessage = () => !!this.specialCondition.protectedPlayer &&
        `Ты умрёшь за игрока ${playerLink(this.specialCondition.protectedPlayer)}.`;

    action = () => {
        if (this.specialCondition.protectedPlayer?.role) {
            this.doneNightAction()
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
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.specialCondition.protectedPlayer?.role) {
            this.specialCondition.protectedPlayer = randomElement(Martyr.game.players
                .filter(p => p !== this.player && p.isAlive))
            await Martyr.game.bot.editMessageText(
                `Ты не успел сделать выбор, так что высшие силы сделали выбор ` +
                `за тебя — ${playerLink(this.specialCondition.protectedPlayer)}`,
                {
                    chat_id: this.player.id,
                    message_id: this.actionMsgId
                }
            )
        }
        if (!this.specialCondition.protectedPlayer.role) return

        const currentTargetHandleDeath = this.specialCondition.protectedPlayer.role
            .handleDeath.bind(this.specialCondition.protectedPlayer.role);

        this.specialCondition.protectedPlayer.role.handleDeath = async (killer?: Player, deathType?: DeathType) => {
            if (!this.player.isAlive) return currentTargetHandleDeath(killer, deathType)

            if (!this.specialCondition.protectedPlayer) return false; // should never be returned

            this.protectedPlayerKiller = killer
            await this.onKilled(this.player)
            this.diedForProtectedPlayer = true
            await Martyr.game.bot.sendMessage(
                this.player.id,
                `Как только ${playerLink(this.specialCondition.protectedPlayer)} оказался(лась) на грани жизни и смерти, `
                + `ты начинаешь молиться Древним Богам, чтобы они забрали тебя вместо него(нее). И они отвечают на `
                + `твои молитвы. Твоя жизнь будет отдана в жертву, но ${playerLink(this.specialCondition.protectedPlayer)} будет жить.`
            )
            await Martyr.game.bot.sendMessage(
                this.specialCondition.protectedPlayer?.id,
                `Ты проснулся(ась) в своем доме из-за того, что почувствовал(а) что-то... Ты помнишь, как `
                + `умирал(а), но что-то или кто-то спас тебя. Имя Мученицы ${playerLink(this.player)} навсегда `
                + `отпечаталось у тебя в сознании. И ты знаешь, что она пожертвовала собой для того, чтобы ты жил(а).`
            )
            return false
        }
    }


    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if (killer === this.player && this.specialCondition.protectedPlayer && !type) {

            let deathMessage: string | undefined
            if (!this.protectedPlayerKiller) deathMessage = `Жители решили казнить ${playerLink(this.specialCondition.protectedPlayer)}, но внезапно яркая `
                + `вспышка света озарила площадь. Она была настолько ослепительна, что жители закрыли глаза. Когда все `
                + `закончилось, они увидели мертвое тело ${playerLink(this.player)} на виселице, в то время как `
                + `${playerLink(this.specialCondition.protectedPlayer)} стоит рядом как ни в чем не бывало.`
            else if (this.protectedPlayerKiller.role instanceof SerialKiller || this.protectedPlayerKiller.role instanceof Wolf) deathMessage = `Селяне собрались `
                + `на следующее утро и увидели лежащее на площади тело Мученицы ${playerLink(this.player)}. `
                + `Вокруг нее были начертаны священные руны Древних Богов. Этой ночью *${this.roleName}* умерла за `
                + `другого человека.`
            else if (this.protectedPlayerKiller.role instanceof Gunner) deathMessage = `Вдруг раздался оглушительный выстрел, и все на площади `
                + `увидели, как ${playerLink(this.protectedPlayerKiller, true)} все еще целится в голову `
                + `${playerLink(this.specialCondition.protectedPlayer)}… Но промахивается и попадает в ${playerLink(this.player)}, в `
                + `то время как ${playerLink(this.specialCondition.protectedPlayer)} стоит абсолютно невредим(а).`
            else if (this.protectedPlayerKiller.role instanceof Cowboy) deathMessage = `${playerLink(this.protectedPlayerKiller, true)} `
                + `второпях целится в ${playerLink(this.specialCondition.protectedPlayer)} и стреляет в последний момент. Но попадает в `
                + `${playerLink(this.player)}, в то время как ${playerLink(this.specialCondition.protectedPlayer)} стоит целый(ая) `
                + `и невредимый(ая).`

            setTimeout( // wtf
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
        this.doneNightAction();
    }

    choiceMsgEditText = () => RoleBase.game.bot.editMessageText(
        `Выбор принят — ${this.specialCondition.protectedPlayer
            ? playerLink(this.specialCondition.protectedPlayer)
            : 'Пропустить'}.`,
        {
            message_id: this.actionMsgId,
            chat_id: this.player.id,
        }
    )
}
import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Player} from "../../Player/Player";
import {Gunner, SerialKiller, Wolf} from "../index";

export class Martyr extends RoleBase {
    readonly roleName = 'Мученица 📿';

    startMessageText = () => `Ты ${this.roleName}.`
    weight = () => 0;

    targetKiller?: Player

    action = () => {
        if (this.targetPlayer?.role) return

        Martyr.game.bot.sendMessage(
            this.player.id,
            'За кого ты хочешь умереть?',
            {
                reply_markup: generateInlineKeyboard(Martyr.game.players.filter(player => player !== this.player &&
                    player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;

        this.targetPlayer.role.handleDeath = (killer) => {
            if (!this.targetPlayer) {
                console.log('asdasdasd121')
                return false;
            }

            this.targetKiller = killer
            this.onKilled(this.player)
            Martyr.game.bot.sendMessage(
                this.player.id,
                `Как только ${highlightPlayer(this.targetPlayer)} оказался(лась) на грани жизни и смерти, `
                + `ты начинаешь молиться Древним Богам, чтобы они забрали тебя вместо него(нее). И они отвечают на `
                + `твои молитвы. Твоя жизнь будет отдана в жертву, но ${highlightPlayer(this.targetPlayer)} будет жить.`
            )
            Martyr.game.bot.sendMessage(
                this.targetPlayer?.id,
                `Ты проснулся(ась) в своем доме из-за того, что почувствовал(а) что-то... Ты помнишь, как `
                + `умирал(а), но что-то или кто-то спас тебя. Имя Мученицы 📿 ${this.player} навсегда отпечаталось у`
                + `тебя в сознании. И ты знаешь, что она подертвовала собой для того, чтобы ты жил(а).`
            )
            return false
        }
    }


    handleDeath(killer?: Player): boolean {
        if (killer !== this.player || !this.targetPlayer) return super.handleDeath(killer);

        let deathMessage
        if (!killer) deathMessage = `Жители решили казнить ${highlightPlayer(this.targetPlayer)}, но внезапно яркая `
            + `вспышка света озарила площадь. Она была настолько ослепительна, что жители закрыли глаза. Когда все `
            + `закончилось, они увидели мертвое тело ${highlightPlayer(this.player)} на виселице, в то время как `
            + `${highlightPlayer(this.targetPlayer)} стоит рядом как ни в чем не бывало.`
        else if (killer.role instanceof SerialKiller || killer.role instanceof Wolf) deathMessage = `Селяне собрались `
            + `на следующее утро и увидели лежащее на площади тело Мученицы 📿 ${highlightPlayer(this.player)}. `
            + `Вокруг нее были начертаны священные руны Древних Богов. Этой ночью ${this.roleName} умерла за `
            + `другого человека.`
        else if (killer.role instanceof Gunner) deathMessage = `Вдруг раздался оглушительный выстрел, и все на площади `
            + `увидели, как ${killer.role.roleName} ${highlightPlayer(killer)} все еще целится в голову `
            + `${highlightPlayer(this.targetPlayer)}… Но промахивается и попадает в ${highlightPlayer(this.player)}, в `
            + `то время как ${highlightPlayer(this.targetPlayer)} стоит абсолютно невредим(а).`
        // else if (killer.role instanceof Cowboy) deathMessage = `${killer.role.roleName} ${highlightPlayer(killer)} `
        //     + `второпях целится в ${highlightPlayer(this.targetPlayer)} и стреляет в последний момент. Но попадает в `
        //     + `${highlightPlayer(this.player)}, в то время как ${highlightPlayer(this.targetPlayer)} стоит целый(ая) `
        //     + `и невредимый(ая).`

        deathMessage && Martyr.game.bot.sendMessage(Martyr.game.chatId, deathMessage)
        return true
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Martyr.game.players);
        this.choiceMsgEditText();
    }
}
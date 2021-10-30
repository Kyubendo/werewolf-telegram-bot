import {RoleBase} from "../Abstract/RoleBase";
import {Player} from "../../Player/Player";
import {Wolf} from "../WolfTeam/Wolf";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";

export class SerialKiller extends RoleBase {
    roleName = 'Серийный убийца 🔪';
    roleIntroductionText = () => `Ты ${this.roleName}. `
    startMessageText = () => `Недавно сбежал из психушки и твоя цель убить всех... ` +
        `Каждую ночь ты можешь добавить по одному телу в свою коллекцию!`
    weight = () => -15; // change?

    killMessageAll = (deadPlayer: Player) => `Эта ночь казалась довольно тихой для ${highlightPlayer(deadPlayer)}, ` +
        `но не тут-то было. Жители, собравшись, обнаружили расчлененное тело, но, на удивление, печени не было ` +
        `на месте... ${this.roleName} снова атаковал! ${highlightPlayer(deadPlayer)} ` +
        `был(а) *${deadPlayer.role?.roleName}*`;
    killMessageDead = `Ты просыпаешься посреди ночи, слыша зловещий смех, когда ${this.roleName} ` +
        'извлекает твои органы. Ты мертв(а).' // GIF

    handleDeath = (killer?: Player) => {
        if (killer?.role instanceof Wolf) {
            SerialKiller.game.bot.sendMessage(
                SerialKiller.game.chatId,
                `Волк попытался хорошо полакомиться этой ночью, но встретил сумасшедшего маньяка! ` +
                `*${killer.role.roleName}* ${highlightPlayer(killer)} погиб.`,
            )
            SerialKiller.game.bot.sendMessage(
                killer.id,
                'Ты вышел на охоту, но сам оказался жертвой.'
                + ' Жертвой, которую разрезали на сотню маленьких кусочков.',
            )

            killer.role.onKilled(killer)
            return false;
        } else
            return super.handleDeath(killer);
    }

    action = () => {
        SerialKiller.game.bot.sendMessage(
            this.player.id,
            'В кого ты хочешь запихнуть пару-тройку ножей?',
            {
                reply_markup: generateInlineKeyboard(
                    SerialKiller.game.players.filter(player => player !== this.player && player.isAlive)
                )
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer) return;
        this.targetPlayer.role?.onKilled(this.player);
        this.targetPlayer = undefined
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, SerialKiller.game.players);
        this.choiceMsgEditText();
    }
}
import {DeathType} from "../../Game";
import {Player} from "../../Game";
import {RoleBase} from "../"
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {Beauty, GuardianAngel, Wolf} from "../index";


export class SerialKiller extends RoleBase {
    roleName = 'Серийный убийца 🔪';
    roleIntroductionText = () => `Ты ${this.roleName}.`
    startMessageText = () => `Недавно сбежал из психушки и твоя цель убить всех... ` +
        `Каждую ночь ты можешь добавить по одному телу в свою коллекцию!`
    weight = () => -12.5;

    nightActionDone = false

    killMessage = () => ({
        text: {
            toChat: (deadPlayer: Player) => `Эта ночь казалась довольно тихой для ${highlightPlayer(deadPlayer)}, ` +
                `но не тут-то было. Жители, собравшись, ` +
                `обнаружили расчлененное тело, но, на удивление, печени не было ` +
                `на месте...\n${this.roleName} снова атаковал!\n${highlightPlayer(deadPlayer)} ` +
                `был(а) *${deadPlayer.role?.roleName}*`,
            toTarget: `Ты просыпаешься посреди ночи, слыша зловещий смех, когда ${this.roleName} ` +
                'извлекает твои органы. Ты мертв(а).'
        },
        gif: 'https://media.giphy.com/media/xzW34nyNLcSUE/giphy.gif'
    })

    handleDeath(killer?: Player, type?: DeathType): boolean {
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

            killer.isAlive = false;
            return false;
        } else
            return super.handleDeath(killer, type);
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
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.targetPlayer) return;

        if (this.targetPlayer.guardianAngel?.role instanceof GuardianAngel) {
            this.handleGuardianAngel(this.player);
            return;
        } else if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player)
            this.player.loveBind(this.targetPlayer);
        else
            this.targetPlayer.role?.onKilled(this.player);
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, SerialKiller.game.players);
        this.choiceMsgEditText();
        this.doneNightAction()
    }
}
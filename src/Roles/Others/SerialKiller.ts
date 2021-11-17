import {DeathType, Player} from "../../Game";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {Beauty, GuardianAngel, Wolf, FallenAngel, RoleBase} from "../index";

export class SerialKiller extends RoleBase {
    roleName = 'Серийный убийца 🔪';
    roleIntroductionText = () => `Ты ${this.roleName}. `
    startMessageText = () => `Недавно сбежал из психушки и твоя цель убить всех... ` +
        `Каждую ночь ты можешь добавить по одному телу в свою коллекцию!`
    weight = () => -13.5; // change?

    nightActionDone = false

    killMessage = () => ({
        text: {
            toChat: (deadPlayer: Player) => `Эта ночь казалась довольно тихой для ${highlightPlayer(deadPlayer)}, ` +
                `но не тут-то было. Жители, собравшись, ` +
                `обнаружили расчлененное тело, но, на удивление, печени не было ` +
                `на месте... ${this.roleName} снова атаковал! ${highlightPlayer(deadPlayer)} ` +
                `был(а) *${deadPlayer.role?.roleName}*`,
            toTarget: `Ты просыпаешься посреди ночи, слыша зловещий смех, когда ${this.roleName} ` +
                'извлекает твои органы. Ты мертв(а).'
        },
        gif: 'https://media.giphy.com/media/xzW34nyNLcSUE/giphy.gif'
    })


    handleDeath(killer?: Player, type?: DeathType): boolean {
        if (killer?.role instanceof Wolf || killer?.role instanceof FallenAngel) {
            killer.role.onKilled(this.player, 'wolfCameToSerialKiller');
            return false;
        } else
            return super.handleDeath(killer, type);
    }

    action = () => {
        this.targetPlayer = undefined

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
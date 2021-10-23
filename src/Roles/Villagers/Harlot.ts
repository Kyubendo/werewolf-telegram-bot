import {Villager} from "./Villager";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {SerialKiller} from "../Others/SerialKiller";
import {Wolf} from "../Wolves/Wolf";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Harlot extends Villager {
    roleName = "Блудница 💋";
    startMessageText = `Ах ты ${this.roleName}! Ты можешь пойти к кому-то ночью и хорошо провести время... \n` +
        'Но, если зло выберет того, к кому ты пошла, вы оба умрете! А если волки выберут тебя, а дома ' +
        'тебя не будет, ты останешься жить, логично...';
    weight = () => 6;

    action = () => {
        if (Harlot.game.stage !== 'night') return;
        Harlot.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь навестить?',
            {
                reply_markup: generateInlineKeyboard(Harlot.game.players
                    .filter(player => player !== player && player.isAlive), true)
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.player.isAlive && Harlot.game.stage !== 'night' && !this.targetPlayer?.role) return;

        if (this.targetPlayer?.role instanceof Wolf || this.targetPlayer?.role instanceof SerialKiller)
            this.onKilled(this.targetPlayer);
        else {
            this.targetPlayer && Harlot.game.bot.sendMessage(
                this.player.id,
                `Ты сразу поняла, что ${highlightPlayer(this.targetPlayer)} не волк и ` +
                `не серийный убийца, потому что ночь была слишком хороша...`,
                {
                    parse_mode: 'Markdown'
                }
            )
        }

        this.targetPlayer = undefined;
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Harlot.game.players);
        this.choiceMsgEditText();
    }

    protected handleDeath(killer?: Player): boolean {
        if (killer?.role instanceof Wolf && this.targetPlayer) {
            this.player.isAlive = false;

            Harlot.game.bot.sendMessage(
                Harlot.game.chatId,
                `${this.player.name} проскользнула в не тот дом прошлой ночью!  Останки распутной ` +
                'жительницы были найдены пригвожденными к дверям цверкви... Как жалко :(',
                {
                    parse_mode: 'Markdown'
                }
            )
            return true;
        }
        return super.handleDeath(killer);
    }
}
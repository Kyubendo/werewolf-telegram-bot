import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {SerialKiller} from "../Others/SerialKiller";
import {Wolf} from "../WolfTeam/Wolf";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RoleBase} from "../Abstract/RoleBase";
import {Beauty} from "./Beauty";

export class Harlot extends RoleBase {
    roleName = "Блудница 💋";
    roleIntroductionMessage = () => `Ах ты ${this.roleName}! `
    startMessageText = () => `Ты можешь пойти к кому-то ночью и хорошо провести время... \n` +
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
                    .filter(player => player !== this.player && player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (Harlot.game.stage !== 'night' || !this.targetPlayer?.role) return;

        if (this.targetPlayer?.role instanceof Wolf || this.targetPlayer?.role instanceof SerialKiller)
            this.onKilled(this.targetPlayer);
        // What if Harlot visits another Harlot
        else if (this.targetPlayer.role instanceof Beauty) {
            this.loveBind(this.targetPlayer);
        } else {
            if (this.targetPlayer) {
                Harlot.game.bot.sendMessage(
                    this.player.id,
                    `Ты сразу поняла, что ${highlightPlayer(this.targetPlayer)} не волк и ` +
                    `не серийный убийца, потому что ночь была слишком хороша...`,
                )
                Harlot.game.bot.sendMessage(
                    this.targetPlayer.id,
                    'Было темно, поэтому ты ничего не помнишь, но этой ночью кто-то оседлал тебя... ' +
                    'И вы оба хорошо провели время!' // GIF
                )
            }
        }

        this.targetPlayer = undefined;
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Harlot.game.players);
        this.choiceMsgEditText();
    }

    handleDeath(killer?: Player): boolean {
        if (killer?.role instanceof Wolf) { // Если волк пытается убить шлюху
            if (this.targetPlayer?.role instanceof Wolf) { // Убивает, если её целью является любой из волков
                this.player.isAlive = false;

                Harlot.game.bot.sendMessage(
                    Harlot.game.chatId,
                    `${highlightPlayer(this.player)} проскользнула в не тот дом прошлой ночью!  ` +
                    'Останки распутной жительницы были найдены пригвожденными к дверям цверкви... Как жалко :(')
                return true;
            } else { // Не убивает, если её целью является не волк
                this.targetPlayer && Harlot.game.bot.sendMessage( // Переделать на много волков
                    this.targetPlayer.id, // Сообщение волку, если он пошёл в шлюху, а её не было дома
                    `Странно... ${this.targetPlayer?.role?.targetPlayer} не была дома! ` +
                    `Нет ужина для тебя сегодня...`,
                )
                return false;
            }
        } else if (killer?.role instanceof Harlot) {
            this.player.isAlive = false;
            return true;
        }
        return super.handleDeath(killer);
    }
}
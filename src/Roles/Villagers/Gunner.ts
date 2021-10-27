import {Villager} from "./Villager";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Player} from "../../Player/Player";

export class Gunner extends Villager {
    roleName = "Стрелок 🔫";
    startMessageText = () => `${this.roleName} выходит на охоту!  ` +
        'У тебя есть две серебрянных пули, чтобы убить кого-то днем. Но имей ввиду, все услышат твой выстрел...';
    weight = () => 6;

    killMessageAll = (deadPlayer: Player) => 'Вдруг послышался выстрел!  Все село оборачивается, ' +
        `чтобы увидеть стоящего ${highlightPlayer(this.player)} над ${highlightPlayer(deadPlayer)}, и ` +
        'оружие все еще нацелено в голову... Мертв(а)! \n' +
        `${highlightPlayer(deadPlayer)} был(а) **${deadPlayer.role?.roleName}**!`


    ammo = 2;

    action = () => {
        if (!this.ammo) return;

        Gunner.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь пристрелить сегодня?',
            {
                reply_markup: generateInlineKeyboard(Gunner.game.players.filter(player => player !== this.player &&
                    player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;

        this.targetPlayer.role.onKilled(this.player);

        this.ammo--;

        this.targetPlayer = undefined;
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Gunner.game.players);
        this.choiceMsgEditText();
    }
}
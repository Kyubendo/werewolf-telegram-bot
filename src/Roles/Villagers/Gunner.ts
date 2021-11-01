import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {RoleBase} from "../Abstract/RoleBase";

export class Gunner extends RoleBase {
    roleName = "Стрелок 🔫";
    roleIntroductionText = () => `${this.roleName} выходит на охоту! `
    startMessageText = () => 'У тебя есть две серебрянных пули, чтобы убить кого-то днем. ' +
        'Но имей ввиду, все услышат твой выстрел...';
    weight = () => 6;

    killMessageDead = 'В тебя попала серебрянная пуля стрелка! Ты мёртв!' // GIF

    actionAnnouncement = () => ({
        message: this.targetPlayer ? 'Вдруг послышался выстрел!  Все село оборачивается, ' +
            `чтобы увидеть стоящего ${highlightPlayer(this.player)} над ${highlightPlayer(this.targetPlayer)}, и ` +
            'оружие все еще нацелено в голову... Мертв(а)! \n' +
            `${highlightPlayer(this.targetPlayer)} был(а) *${ this.targetPlayer.role?.roleName}*!` : 'ERROR! Gunner-19',
        gif: 'https://media.giphy.com/media/reNAILRU3ab96/giphy.gif'
    })


    ammo = 2;

    action = () => {
        this.targetPlayer = undefined;

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
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Gunner.game.players);
        this.choiceMsgEditText();
    }
}
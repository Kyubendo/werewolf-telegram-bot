import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {randomElement} from "../../Utils/randomElement";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Player} from "../../Player/Player";
import {Wolf} from "../WolfTeam/Wolf";

export class WildChild extends RoleBase {
    roleName = 'Дикий ребёнок 👶';
    roleIntroductionText = () => `Ты ${this.roleName}! `
    startMessageText = () => 'Выбери любого игрока, чтобы он стал твоим "примером". Если он умрет, ты станешь волком!'
    weight = () => -1;

    action = () => {
        if (this.targetPlayer?.role) return;

        WildChild.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь выбрать своим примером?',
            {
                reply_markup: generateInlineKeyboard(
                    WildChild.game.players.filter(player => player !== this.player && player.isAlive), false)
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer?.role) {
            this.targetPlayer = randomElement(WildChild.game.players.filter(player => player !== this.player)) // player.isAlive probably redundant because of roleResolves order
            WildChild.game.bot.editMessageText(
                `Ты не успел сделать выбор, так что высшие силы сделали выбор ` +
                `за тебя — ${highlightPlayer(this.targetPlayer)}`,
                {
                    chat_id: this.player.id,
                    message_id: this.choiceMsgId
                }
            )
        }

        if (!this.targetPlayer.role) return;

        const currentTargetHandleDeath = this.targetPlayer.role.handleDeath;
        this.targetPlayer.role.handleDeath = (killer?: Player): boolean => {
            if (!this.targetPlayer) return false;

            this.player.role = new Wolf(this.player, this.player.role);

            WildChild.game.bot.sendMessage(
                this.player.id,
                `Твой "пример" ${highlightPlayer(this.targetPlayer)} умер! Теперь ты ${this.roleName}! ` +
                (this.player.role instanceof Wolf && this.player.role.showOtherWolfPlayers())
            )

            return currentTargetHandleDeath(killer);
        }
    }

    handleDeath(killer?: Player): boolean {
        if (killer?.role instanceof Wolf) {
            WildChild.game.bot.sendMessage(
                WildChild.game.chatId,
                'НОМНОМНОМНОМ! Прошлой ночью волк(и) ' +
                `сьел(и) Дикого ребенка ${highlightPlayer(this.player)}, оставив лишь маленький скелетик. ` +
                'Селяне поняли, насколько волк(и) безжалостны, раз так хладнокровно ' +
                'убивают(ет) беззащитных детей.'
            )
        }
        return super.handleDeath(killer);
    }
}

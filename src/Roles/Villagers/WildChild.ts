import {DeathType} from "../../Game";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {randomElement} from "../../Utils/randomElement";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Player} from "../../Player/Player";
import {Wolf} from "../WolfTeam/Wolf";
import {findPlayer} from "../../Game/findPlayer";
import {specialConditionWildChild} from "../../Utils/specialConditionTypes";
import {RoleBase} from "../index";

export class WildChild extends RoleBase {
    roleName = 'Дикий ребёнок 👶';
    roleIntroductionText = () => `Ты ${this.roleName}! `
    startMessageText = () => 'Выбери любого игрока, чтобы он стал твоим "примером". Если он умрет, ты станешь волком!'
    weight = () => -1;

    nightActionDone = false

    specialCondition: specialConditionWildChild = {
        roleModel: undefined
    }

    action = () => {
        if (this.specialCondition.roleModel?.role) {
            this.doneNightAction()
            return
        }
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
        if (!this.specialCondition.roleModel?.role) {
            this.specialCondition.roleModel = randomElement(WildChild.game.players
                .filter(player => player !== this.player && player.isAlive)) // player.isAlive probably redundant because of roleResolves order
            WildChild.game.bot.editMessageText(
                `Ты не успел сделать выбор, так что высшие силы сделали выбор ` +
                `за тебя — ${highlightPlayer(this.specialCondition.roleModel)}`,
                {
                    chat_id: this.player.id,
                    message_id: this.choiceMsgId
                }
            )
        }

        if (!this.specialCondition.roleModel.role) return;

        const currentTargetHandleDeath = this.specialCondition.roleModel.role
            .handleDeath.bind(this.specialCondition.roleModel.role);
        this.specialCondition.roleModel.role.handleDeath = (killer?: Player, type?: DeathType): boolean => {
            currentTargetHandleDeath(killer, type);

            if (!this.specialCondition.roleModel || this.player.role instanceof Wolf) return false;

            this.player.role = new Wolf(this.player, this.player.role);

            if (this.player.role instanceof Wolf) {
                WildChild.game.bot.sendMessage(
                    this.player.id,
                    `Твой "пример" ${highlightPlayer(this.specialCondition.roleModel)} умер! ` +
                    `Теперь ты ${this.player.role.roleName}! ` +
                    this.player.role.showOtherWolfPlayers()
                )

                this.player.role.findOtherWolfPlayers().forEach(player => WildChild.game.bot.sendMessage(
                    player.id,
                    `Пример игрока ${highlightPlayer(this.player)} умер! Теперь, он стал волком!`
                ))
            }

            return true;
        }
    }

    handleDeath(killer?: Player, type?: DeathType) {
        if (killer?.role instanceof Wolf && !type) {
            WildChild.game.bot.sendMessage(
                WildChild.game.chatId,
                'НОМНОМНОМНОМ! Прошлой ночью волк(и) ' +
                `сьел(и) Дикого ребенка ${highlightPlayer(this.player)}, оставив лишь маленький скелетик. ` +
                'Селяне поняли, насколько волк(и) безжалостны, раз так хладнокровно ' +
                'убивают(ет) беззащитных детей.'
            )
            WildChild.game.bot.sendAnimation(
                this.player.id,
                killer.role.killMessage().gif,
                {
                    caption: killer.role.killMessage().text.toTarget
                }
            )
            this.player.isAlive = false;
            return true;
        } else
            return super.handleDeath(killer, type);
    }

    handleChoice = (choice?: string) => {
        this.specialCondition.roleModel = findPlayer(choice, WildChild.game.players);
        if (this.specialCondition.roleModel)
            this.stealMessage = `\nТвой "пример" — ${highlightPlayer(this.specialCondition.roleModel)}.`;
        this.choiceMsgEditText();
        this.doneNightAction()
    }

    choiceMsgEditText = () => RoleBase.game.bot.editMessageText(
        `Выбор принят — ${this.specialCondition.roleModel
            ? highlightPlayer(this.specialCondition.roleModel)
            : 'Пропустить'}.`,
        {
            message_id: this.choiceMsgId,
            chat_id: this.player.id,
        }
    )
}

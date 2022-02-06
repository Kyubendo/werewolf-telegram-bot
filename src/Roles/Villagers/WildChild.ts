import {DeathType, Player} from "../../Game";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {randomElement} from "../../Utils/randomElement";
import {playerLink} from "../../Utils/playerLink";
import {findPlayer} from "../../Game/findPlayer";
import {specialConditionWildChild} from "../../Utils/specialConditionTypes";
import {RoleBase, Wolf} from "../index";

export class WildChild extends RoleBase {
    roleName = 'Дикий ребёнок 👶';
    startMessageText = () => 'Выбери любого игрока, чтобы он стал твоим "примером". Если он умрет, ты станешь волком!'

    nightActionDone = false

    specialCondition: specialConditionWildChild = {
        roleModel: undefined
    }

    stealMessage = () => !!this.specialCondition.roleModel
        && `\nТвой "пример" — ${playerLink(this.specialCondition.roleModel)}.`

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
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.specialCondition.roleModel?.role) {
            this.specialCondition.roleModel = randomElement(WildChild.game.players
                .filter(player => player !== this.player && player.isAlive)) // player.isAlive probably redundant because of roleResolves order
            if (!this.specialCondition.roleModel) return
            await WildChild.game.bot.editMessageText(
                `Ты не успел сделать выбор, так что высшие силы сделали выбор ` +
                `за тебя — ${playerLink(this.specialCondition.roleModel)}`,
                {
                    chat_id: this.player.id,
                    message_id: this.actionMsgId
                }
            )
        }

        if (!this.specialCondition.roleModel.role) return;

        const currentTargetHandleDeath = this.specialCondition.roleModel.role
            .handleDeath.bind(this.specialCondition.roleModel.role);
        this.specialCondition.roleModel.role.handleDeath = async (killer?: Player, type?: DeathType) => {
            await currentTargetHandleDeath(killer, type);

            if (this.specialCondition.roleModel && !(this.player.role instanceof Wolf)) {
                this.player.role = new Wolf(this.player, this.player.role);

                if (!(this.player.role instanceof Wolf)) {
                } else {
                    await WildChild.game.bot.sendMessage(
                        this.player.id,
                        `Твой "пример" ${playerLink(this.specialCondition.roleModel)} умер! ` +
                        `Теперь ты ${this.player.role.roleName}!`
                    )

                    await this.player.role.sendAlliesMessage?.(true)

                    this.player.role.findAllies().forEach(player => WildChild.game.bot.sendMessage(
                        player.id,
                        `Пример игрока ${playerLink(this.player)} умер! Теперь, он стал волком!`
                    ))
                }
            }

            return true;
        }
    }

    async handleDeath(killer?: Player, type?: DeathType) {
        if (killer?.role instanceof Wolf && !type) {
            await WildChild.game.bot.sendMessage(
                WildChild.game.chatId,
                'НОМНОМНОМНОМ! Прошлой ночью волк(и) ' +
                `сьел(и) Дикого ребенка ${playerLink(this.player)}, оставив лишь маленький скелетик. ` +
                'Селяне поняли, насколько волк(и) безжалостны, раз так хладнокровно ' +
                'убивают(ет) беззащитных детей.'
            )
            await WildChild.game.bot.sendAnimation(
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
        this.choiceMsgEditText();
        this.doneNightAction()
    }

    choiceMsgEditText = () => RoleBase.game.bot.editMessageText(
        `Выбор принят — ${this.specialCondition.roleModel
            ? playerLink(this.specialCondition.roleModel)
            : 'Пропустить'}.`,
        {
            message_id: this.actionMsgId,
            chat_id: this.player.id,
        }
    )
}

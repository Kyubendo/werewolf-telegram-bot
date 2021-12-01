import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {randomElement} from "../../Utils/randomElement";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {findPlayer} from "../../Game/findPlayer";
import {Mason, Wolf} from "../index";
import {rolesThatNeedStealMessage} from "../../Utils/teams";

export class Doppelganger extends RoleBase {
    roleName = 'Двойник 🎭';
    roleIntroductionText = () => `Ты ${this.roleName}.`
    startMessageText = () => 'Легенда гласит, что твои предки были Метаморфами и могли выбирать любую форму бытия, ' +
        'какую только пожелали... Ты унаследовал часть их способностей! Выбери игрока, когда он умрет, ' +
        'ты получишь его роль.'
    weight = () => -1;

    nightActionDone = false

    action = () => {
        if (this.targetPlayer?.role) {
            this.doneNightAction()
            return;
        }

        Doppelganger.game.bot.sendMessage(
            this.player.id,
            'Роль какого игрока ты хочешь скопировать?',
            {
                reply_markup: generateInlineKeyboard(
                    Doppelganger.game.players.filter(player => player !== this.player && player.isAlive),
                    false
                )
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.targetPlayer?.role) {
            this.targetPlayer = randomElement(Doppelganger.game.players
                .filter(player => this.player !== player && player.isAlive))
            Doppelganger.game.bot.editMessageText(
                `Ты не успел сделать выбор, ` +
                `так что высшие силы сделали выбор за тебя: ${highlightPlayer(this.targetPlayer)}.`,
                {
                    chat_id: this.player.id,
                    message_id: this.actionMsgId
                }
            )
        }

        if (!this.targetPlayer.role) return;

        const currentTargetHandleDeath = this.targetPlayer.role.handleDeath.bind(this.targetPlayer.role)
        this.targetPlayer.role.handleDeath = async (killer?, type?) => {
            if (!this.targetPlayer?.role) return false;
            await Doppelganger.game.bot.sendMessage(
                this.player.id,
                `${highlightPlayer(this.targetPlayer)} погиб, и ты трансформировался!\n\n` +
                this.targetPlayer.role.roleIntroductionText() + ' ' + this.targetPlayer.role.startMessageText()
            )

            this.player.role = this.targetPlayer.role.createThisRole(this.player, this.player.role);

            await rolesThatNeedStealMessage.forEach(r => this.player.role instanceof r && Doppelganger.game.bot
                .sendMessage(
                    this.player.id,
                    this.player.role.stealMessage()
                ))

            if (this.player.role instanceof Mason)
                this.player.role.findOtherMasonPlayers().forEach(masonPlayer => masonPlayer.role?.newMemberNotification)
            else if (this.player.role instanceof Wolf)
                this.player.role.findOtherWolfPlayers().forEach(wolfPlayer => wolfPlayer.role?.newMemberNotification)

            return currentTargetHandleDeath(killer, type);
        }
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Doppelganger.game.players);
        this.choiceMsgEditText();
        this.doneNightAction()
    }
}
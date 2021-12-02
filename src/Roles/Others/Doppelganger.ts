import {generateInlineKeyboard} from "../../Game/playersButtons";
import {randomElement} from "../../Utils/randomElement";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {findPlayer} from "../../Game/findPlayer";
import {Arsonist, Beholder, RoleBase} from "../index";

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
            await Doppelganger.game.bot.editMessageText(
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
            const handleDeathResult: Promise<boolean> = currentTargetHandleDeath(killer, type);

            if (this.targetPlayer?.role) {
                this.player.role = this.targetPlayer.role.createThisRole(this.player, this.player.role);

                await Doppelganger.game.bot.sendMessage(
                    this.player.id,
                    `${highlightPlayer(this.targetPlayer)} погиб, и ты трансформировался!\n` +
                    `Теперь ты ${this.player.role.roleName}!`
                )

                this.player.role.sendAlliesMessage && await Doppelganger.game.bot.sendMessage(
                    this.player.id,
                    await this.player.role.sendAlliesMessage(true)
                )

                if (this.player.role instanceof Arsonist || this.player.role instanceof Beholder)
                    await Doppelganger.game.bot.sendMessage(
                        this.player.id,
                        this.player.role.stealMessage()
                    )
            }
            return handleDeathResult;
        }
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Doppelganger.game.players);
        this.choiceMsgEditText();
        this.doneNightAction()
    }
}
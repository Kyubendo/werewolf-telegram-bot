import {DeathType} from "../../Game";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {SerialKiller, Wolf, Beauty, RoleBase} from "../";
import {Player} from "../../Game";

export class GuardianAngel extends RoleBase {
    roleName = 'Ангел-хранитель 👼';
    startMessageText = () => `Беги спасай свой народ! Но берегись волков, есть ` +
        '50% вероятности что тебя съедят, если выберешь их.';
    weight = () => 6.5;

    nightActionDone = false

    numberOfAttacks: number = 0;

    action = () => {
        this.numberOfAttacks = 0;

        GuardianAngel.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь защитить?',
            {
                reply_markup: generateInlineKeyboard(GuardianAngel.game.players
                    .filter(player => player !== this.player && player.isAlive))
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.targetPlayer?.role) return;

        if (this.targetPlayer.role instanceof SerialKiller || (this.targetPlayer.role instanceof Wolf && Math.random() >= 0.5)) {
            await this.onKilled(this.player);
        } else if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
            await this.player.loveBind(this.targetPlayer);
        } else {
            this.targetPlayer.guardianAngel = this.player;
        }
    }

    actionResult = async () => {
        if (!this.targetPlayer?.role) return;

        if (!this.numberOfAttacks) {
            await GuardianAngel.game.bot.sendMessage(
                this.player.id,
                `${highlightPlayer(this.targetPlayer)} не был(а) атакован(а),` +
                'поэтому ничего не произошло особо...'
            )
        }
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, GuardianAngel.game.players);
        this.choiceMsgEditText();
        this.doneNightAction()
    }

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        this.player.isAlive = false;

        if (killer?.role instanceof GuardianAngel) { // Когда ангел "убил себя" (защитил зло)
            if (this.targetPlayer?.role instanceof SerialKiller) { // Если ангел попытался защитить серийника
                await GuardianAngel.game.bot.sendMessage(
                    this.player.id,
                    'Ты попытался сохранить жизнь Серийному убийце, ' +
                    'а в ответ тебя случайно пырнули 69 раз вилкой! Ты умер...'
                )

                await GuardianAngel.game.bot.sendMessage(
                    GuardianAngel.game.chatId,
                    `Ночью *${this.roleName}* — ${highlightPlayer(this.player)} пытался спасти деревню ` +
                    `от маньяка раз и навсегда, но маньяк отрезал ${highlightPlayer(this.player)} крылья! ` +
                    'Рядом с его телом была записка: "Я не нуждаюсь в твоей защите!"'
                )
            } else if (this.targetPlayer?.role instanceof Wolf) { // Если ангел попытался защитить волка
                await GuardianAngel.game.bot.sendMessage(
                    this.player.id,
                    'Твоя сила подвела тебя, ты неудачно защитил волка, и тебя съели!'
                )

                await GuardianAngel.game.bot.sendMessage(
                    GuardianAngel.game.chatId,
                    `${highlightPlayer(this.player)} безнадёжно пытается защитить волка. ` +
                    'Селу удаётся лишь увидеть белоснежные крылья с каплями крови, ' +
                    'прибитые оторванными рёбрами к крыше церкви. Совершенно очевидно, ' +
                    'что волки расценили ангела как божественный дар, бесплатное мясо, ' +
                    'и не устояли забрать его в свои дома.'
                )
            }
        } else if (killer?.role instanceof Wolf || killer?.role instanceof SerialKiller) {
            await GuardianAngel.game.bot.sendAnimation(
                this.player.id,
                killer.role.killMessage().gif,
                {
                    caption: killer.role.killMessage().text.toTarget
                }
            )

            if (killer.role instanceof Wolf)
                await GuardianAngel.game.bot.sendMessage(
                    GuardianAngel.game.chatId,
                    'Кровавый рассвет оросил нежным светом девственные, нежные руки ' +
                    'Ангела вашего Хранителя, прибитые гвоздями к кресту на куполе церкви. ' +
                    `${highlightPlayer(this.player)} невинная жертва волчьей шутки, ` +
                    `воспарив в небеса таким садистским способом...`
                )
            else
                await GuardianAngel.game.bot.sendMessage(
                    GuardianAngel.game.chatId,
                    'Занятно: ангелы спасают других от убийц, а себя спасти не могут. ' +
                    `*${this.roleName}* — ${highlightPlayer(this.player)} мёртв.`
                )
        } else
            return super.handleDeath(killer, type);
        return true;
    }
}


import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {SerialKiller, Wolf} from "../index";
import {Player} from "../../Player/Player";
import {RoleBase} from "../Abstract/RoleBase";
import {Beauty} from "./Beauty";

export class GuardianAngel extends RoleBase {
    roleName = 'Ангел-хранитель 👼';
    startMessageText = () => `Беги спасай свой народ! Но берегись волков, есть ` +
        '50% вероятности что тебя съедят, если выберешь их.';
    weight = () => 7;


    numberOfAttacks: number = 0;

    action = () => {
        GuardianAngel.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь защитить?',
            {
                reply_markup: generateInlineKeyboard(GuardianAngel.game.players
                    .filter(player => player !== this.player && player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;

        if (this.targetPlayer.role instanceof SerialKiller ||
            (this.targetPlayer.role instanceof Wolf && Math.random() >= 0.5))
            this.onKilled(this.player)
        else if (this.targetPlayer.role instanceof Beauty)
            this.loveBind(this.targetPlayer);
        else {
            if (!this.numberOfAttacks) {
                GuardianAngel.game.bot.sendMessage(
                    this.player.id,
                    `${highlightPlayer(this.targetPlayer)} не был(а) атакован(а),` +
                    'поэтому ничего не произошло особо...'
                )
            }
        }
      
        this.numberOfAttacks = 0;
        this.targetPlayer = undefined; // В таком случае actionResolve ангела должен идти последним
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, GuardianAngel.game.players);
        this.choiceMsgEditText();

        if (this.targetPlayer?.role) {
            this.targetPlayer.role.handleDeath = (killer?: Player): boolean => {
                if (killer && this.targetPlayer) {
                    RoleBase.game.bot.sendMessage(
                        killer.id,
                        `Придя домой к ${highlightPlayer(this.targetPlayer)}, ` +
                        `у дверей ты встретил Ангела-хранителя, ` +
                        'и тебя вежливо попросили свалить. Ты отказался, потому тебе надавали лещей и ты убежал.'
                    )

                    RoleBase.game.bot.sendMessage(
                        this.targetPlayer.id,
                        `${this.roleName}  наблюдал за тобой этой ночью и защитил тебя от зла!`
                    )

                    let ending: string = '';
                    if (this.numberOfAttacks)
                        ending = ' Снова!'

                    RoleBase.game.bot.sendMessage(
                        this.player.id,
                        `С выбором ты угадал, на ${highlightPlayer(this.targetPlayer)} ` +
                        `действительно напали! Ты спас ему жизнь!` + ending
                    )

                    this.numberOfAttacks++;

                    return false;
                }
                return true;
            }
        }
    }

    handleDeath(killer?: Player): boolean {
        this.player.isAlive = false;

        if (killer?.role instanceof GuardianAngel) { // Когда ангел "убил себя" (защитил зло)
            if (this.targetPlayer?.role instanceof SerialKiller) { // Если ангел попытался защитить серийника
                GuardianAngel.game.bot.sendMessage(
                    this.player.id,
                    'Ты попытался сохранить жизнь Серийному убийце, ' +
                    'а в ответ тебя случайно пырнули 69 раз вилкой! Ты умер...'
                )

                GuardianAngel.game.bot.sendMessage(
                    GuardianAngel.game.chatId,
                    `Ночью *${this.roleName}* — ${highlightPlayer(this.player)} пытался спасти деревню ` +
                    `от маньяка раз и навсегда, но маньяк отрезал ${highlightPlayer(this.player)} крылья! ` +
                    'Рядом с его телом была записка: "Я не нуждаюсь в твоей защите!"'
                )
            } else if (this.targetPlayer?.role instanceof Wolf) { // Если ангел попытался защитить волка
                GuardianAngel.game.bot.sendMessage(
                    this.player.id,
                    'Твоя сила подвела тебя, ты неудачно защитил волка, и тебя съели!'
                )

                GuardianAngel.game.bot.sendMessage(
                    GuardianAngel.game.chatId,
                    `${highlightPlayer(this.player)} безнадёжно пытается защитить волка. ` +
                    'Селу удаётся лишь увидеть белоснежные крылья с каплями крови, ' +
                    'прибитые оторванными рёбрами к крыше церкви. Совершенно очевидно, ' +
                    'что волки расценили ангела как божественный дар, бесплатное мясо, ' +
                    'и не устояли забрать его в свои дома.'
                )
            }
        } else if (killer?.role instanceof Wolf || killer?.role instanceof SerialKiller) { // Если ангела убил волк или серия
            GuardianAngel.game.bot.sendMessage( // Сообщение в личку
                this.player.id,
                killer.role.killMessageDead
            )

            if (killer.role instanceof Wolf)
                GuardianAngel.game.bot.sendMessage( // Сообщение в чат, если убил волк
                    GuardianAngel.game.chatId,
                    'Кровавый рассвет оросил нежным светом девственные, нежные руки ' +
                    'Ангела вашего Хранителя, прибитые гвоздями к кресту на куполе церкви. ' +
                    `${highlightPlayer(this.player)} невинная жертва волчьей шутки, ` +
                    `воспарив в небеса таким садистским способом...`
                )
            else
                GuardianAngel.game.bot.sendMessage( // Сообщение в чат, если убил серийник
                    GuardianAngel.game.chatId,
                    'Занятно: ангелы спасают других от убийц, а себя спасти не могут. ' +
                    `*${this.roleName}* — ${highlightPlayer(this.player)} мёртв.`
                )
        } else
            return super.handleDeath(killer);
        return true;
    }
}


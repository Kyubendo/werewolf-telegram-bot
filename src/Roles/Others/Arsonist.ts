import {RoleBase} from "../index";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";

export class Arsonist extends RoleBase {
    roleName = 'Поджигатель 🔥';
    startMessageText = () => Math.random() < .95
        ? 'У тебя есть секретный рецепт легковоспламеняющегося раствора, который может сжечь село до основания. '
        + 'Каждую ночь ты можешь обливать чей-то дом этим зельем. Если хотя бы один дом залит, ты можешь зажечь все '
        + 'залитые, сжигая жителей внутри.'
        : 'Ты можешь нарисовать магическую картину и незаметно оставить её в доме одного из жителей. Магия этой '
        + 'картины может превратить весь дом в горстку пепла. Если хотя бы в одном доме висит картина, ты можешь '
        + 'использовать свою магию, чтобы сжечь все дома с картинами, сжигая жителей внутри.'
    weight = () => -8

    action = () => {
        if (Arsonist.game.players.find(p => p.readyToArson)) {
            Arsonist.game.bot.sendMessage(
                this.player.id,
                'Что ты хочешь сделать?',
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Подготовить ещё один дом',
                                callback_data: JSON.stringify({type: 'role', choice: 'prepare'})
                            }],
                            [{text: 'Сжечь всё!', callback_data: JSON.stringify({type: 'role', choice: 'burn'})}],
                        ]
                    }
                }
            ).then(msg => this.choiceMsgId = msg.message_id)
        } else {

        }
    }

    prepareHouse = () => Arsonist.game.bot.sendMessage(
        this.player.id,
        'Кто станет твоей жертвой?',
        {
            reply_markup: generateInlineKeyboard(
                Arsonist.game.players.filter(p => p !== this.player && p.isAlive && !p.readyToArson)
            )
        }
    ).then(msg => this.choiceMsgId = msg.message_id)

    handleChoice = (choice?: string) => {
        switch (choice) {
            case undefined:
                break
            case 'prepare':
                Arsonist.game.bot.editMessageText(
                    `Выбор принят — *Подготовить ещё один дом.*`,
                    {message_id: this.choiceMsgId, chat_id: this.player.id,}
                ).then(this.prepareHouse)
                break
            case 'burn':
                const burnedPlayers = Arsonist.game.players.filter(p => p.readyToArson && p.role?.onKilled(this.player))

                this.doneNightAction()
                break
            default:
                this.targetPlayer = findPlayer(choice, Arsonist.game.players);
                this.choiceMsgEditText();
                this.doneNightAction()
        }
    }


    nightActionDone = false
}
import {RoleBase} from "../index";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Arsonist extends RoleBase {
    roleName = 'Поджигатель 🔥';
    startMessageText = () => Math.random() < .95
        ? 'У тебя есть секретный рецепт легковоспламеняющегося раствора, который может сжечь село до основания. '
        + 'Каждую ночь ты можешь обливать чей-то дом этим зельем. Если хотя бы один дом залит, ты можешь зажечь все '
        + 'залитые, сжигая жителей внутри.'
        : 'Ты можешь нарисовать волшебную картину и незаметно оставить её в доме одного из жителей. Магия этой '
        + 'картины может превратить весь дом в горстку пепла. Если хотя бы в одном доме висит картина, ты можешь '
        + 'использовать свою магию, чтобы сжечь все дома с картинами, сжигая жителей внутри.'
    weight = () => -8

    nightActionDone = false

    killMessage = () => ({
        text: {
            toChat: (deadPlayer: Player) => `Когда деревня просыпается, кто-то замечает, что дом `
                + `${highlightPlayer(deadPlayer)} уже не тот, что был раньше! Вместо прекрасного светлого дома `
                + `лежат только пепел и сажа.`,
            toTarget: 'Ты сгорел.',
        },
        gif: 'https://media.giphy.com/media/xzW34nyNLcSUE/giphy.gif', // change
    })

    burn = false
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
            this.prepareHouse()
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


    actionResolve = () => {
        if (this.burn) Arsonist.game.players.forEach(p => p.readyToArson && p.role?.onKilled(this.player))
        else if (this.targetPlayer) this.targetPlayer.readyToArson = true
    }

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
                Arsonist.game.bot.editMessageText(
                    `Выбор принят — *Сжечь всё.*`,
                    {message_id: this.choiceMsgId, chat_id: this.player.id,}
                ).then(this.doneNightAction)
                this.burn = true
                break
            default:
                this.targetPlayer = findPlayer(choice, Arsonist.game.players);
                this.choiceMsgEditText();
                this.doneNightAction()
        }
    }
}

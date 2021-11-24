import {RoleBase} from "../index";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {Player} from "../../Player/Player";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class Arsonist extends RoleBase {
    roleName = 'Поджигатель 🔥';
    startMessageText = () => Math.random() < .9
        ? 'У тебя есть секретный рецепт легковоспламеняющегося раствора, который может сжечь село до основания. '
        + 'Каждую ночь ты можешь обливать чей-то дом этим зельем. Если хотя бы один дом залит, ты можешь зажечь все '
        + 'залитые, сжигая жителей внутри.'
        : 'Ты можешь нарисовать волшебную картину и незаметно оставить её в доме одного из жителей. Магия этой '
        + 'картины может превратить весь дом в горстку пепла. Если хотя бы в одном доме висит картина, ты можешь '
        + 'использовать свою магию, чтобы поджечь все дома с картинами, сжигая жителей внутри.'
    weight = () => -7

    nightActionDone = false

    killMessage = () => ({
        text: {
            toChat: (deadPlayer: Player) => `Когда деревня просыпается, кто-то замечает, что дом `
                + `${highlightPlayer(deadPlayer)} уже не тот, что был раньше! Вместо прекрасного светлого дома `
                + `лежат только пепел и сажа.`,
            toTarget: 'Когда ты открываешь глаза, ты видишь только пламя сжигающее весь твой дом... Ты сгорел.',
        },
        gif: 'https://media.giphy.com/media/NTur7XlVDUdqM/giphy.gif', // https://media.giphy.com/media/xUOwGpaKq5xjHNz8Bi/giphy.gif
    })
    stealMessage = () => {
        const preparedPlayers = Arsonist.game.players.filter(p => p.isAlive && p.readyToArson)
        return preparedPlayers.length
            ? 'И дома этих игроков уже подготовлены: ' + preparedPlayers.map(p => highlightPlayer(p)).join(', ')
            : 'Но ещё ни один дом не готов к поджогу.'
    }


    burn = false
    action = () => this.firstChoice()

    firstChoice = () => {
        this.burn = false
        const inline_keyboard = []

        Arsonist.game.players.find(p => p.readyToArson) &&
        inline_keyboard.push([{
            text: 'Сжечь всё!',
            callback_data: JSON.stringify({type: 'role', choice: 'burn'})
        }])
        Arsonist.game.players.find(p => p !== this.player && !p.readyToArson) &&
        inline_keyboard.push([{
            text: 'Подготовить дом к поджогу',
            callback_data: JSON.stringify({type: 'role', choice: 'prepare'})
        }])
        inline_keyboard.push([{
            text: 'Пропустить',
            callback_data: JSON.stringify({type: 'role', choice: 'skip'})
        }])
        Arsonist.game.bot.sendMessage(
            this.player.id,
            'Что ты хочешь сделать?',
            {reply_markup: {inline_keyboard}}
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    prepareHouse = () => Arsonist.game.bot.sendMessage(
        this.player.id,
        'Кто станет твоей жертвой?',
        {
            reply_markup: generateInlineKeyboard(
                Arsonist.game.players.filter(p => p !== this.player && p.isAlive && !p.readyToArson),
                false,
                'role',
                true,
            ),
        }
    ).then(msg => this.choiceMsgId = msg.message_id)


    actionResolve = async () => {
        if (this.burn) Arsonist.game.players.forEach(p => p.readyToArson && p.role?.onKilled(this.player))
        else if (this.targetPlayer) this.targetPlayer.readyToArson = true
    }

    handleChoice = (choice?: string) => {
        let selectedChoice
        switch (choice) {
            case undefined:
            case 'skip':
                selectedChoice = 'Пропустить'
                this.doneNightAction()
                break
            case 'prepare':
                selectedChoice = 'Подготовить дом к поджогу'
                this.prepareHouse()
                break
            case 'burn':
                selectedChoice = 'Сжечь всё!'
                this.burn = true
                this.doneNightAction()
                break
            case 'back':
                selectedChoice = 'Назад'
                this.firstChoice()
                break
            default:
                this.targetPlayer = findPlayer(choice, Arsonist.game.players);
                this.choiceMsgEditText();
                this.doneNightAction()
        }
        selectedChoice && Arsonist.game.bot.editMessageText(
            `Выбор принят — *${selectedChoice}*`,
            {message_id: this.choiceMsgId, chat_id: this.player.id,}
        )
    }
}

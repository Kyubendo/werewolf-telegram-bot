import {Pumpkin, RoleBase, Beauty} from "../";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {playerLink} from "../../Utils/playerLink";

export class JackOLantern extends RoleBase {
    roleName = 'Jack-O-Lantern 🎃🔥';
    startMessageText = () => 'Поздравляем с Хэллоуином 2021! ' +
        'Превращай остальный игроков в тыквы! Превращённые игроки на один день окажутся абсолютно беспомощными, ' +
        'после чего твоё заклинание потеряют силу и они вернут свою прежнюю форму. ' +
        `Учти, что с шансом 25% тыква вместо своей прежней формы обретёт форму Джека ` +
        `и вступит в твою команду, но ты об этом не узнаешь.\n` +
        'Испорти всем людишкам праздник! ';
    weight = () => -12;


    action = () => {
        JackOLantern.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь превратить в тыкву?',
            {
                reply_markup: generateInlineKeyboard(
                    JackOLantern.game.players.filter(player => player !== this.player && player.isAlive)
                )
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.targetPlayer) return;

        if (this.targetPlayer.role instanceof Pumpkin) {
            await JackOLantern.game.bot.sendMessage(
                this.player.id,
                `Ты пришёл домой к ${playerLink(this.targetPlayer)}, но видишь что он уже тыква! ` +
                `Кто-то тебя опередил.`
            )
            return;
        } else if (this.targetPlayer.role instanceof Beauty) {
            await this.player.loveBind(this.targetPlayer);
            return;
        }

        const specialCondition = this.targetPlayer.role?.specialCondition;
        this.targetPlayer.role = new Pumpkin(this.targetPlayer, this.targetPlayer.role)
        this.targetPlayer.role.specialCondition = specialCondition;


        await JackOLantern.game.bot.sendAnimation(
            this.targetPlayer.id,
            'https://media.giphy.com/media/12eLy0DOnVE6mA/giphy.gif',
            {
                caption: 'О нет! Тебя превратили в тыкву...'
            }
        )

        await JackOLantern.game.bot.sendMessage(
            this.player.id,
            `${playerLink(this.targetPlayer)} успешно превращён в тыкву.`
        )
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, JackOLantern.game.players);
        this.choiceMsgEditText();
    }
}
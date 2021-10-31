import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {Pumpkin} from "../Others/Pumpkin";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class JackOLantern extends RoleBase {
    roleName = 'Jack-O-Lantern 🎃🔥';
    startMessageText = () => 'Поздравляем с Хэллоуином 2021! ' +
        'Превращай остальный игроков в тыквы! Превращённые игроки на один день окажутся абсолютно беспомощными, ' +
        'после чего твоё заклинание потеряют силу и они вернут свою прежнюю форму. ' +
        `Учти, что с шансом 25% тыква вместо своей прежней формы обретёт форму Джека ` +
        `и вступит в твою команду, но ты об этом не узнаешь.\n` +
        'Испорти всем людишкам праздник! ';
    weight = () => -7;


    action = () => {
        this.targetPlayer = undefined;

        JackOLantern.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь превратить в тыкву?',
            {
                reply_markup: generateInlineKeyboard(
                    JackOLantern.game.players.filter(player => player !== this.player && player.isAlive)
                )
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer) return;

        this.targetPlayer.role = new Pumpkin(this.targetPlayer, this.targetPlayer.role)
        console.log(this.targetPlayer.role.roleName)

        JackOLantern.game.bot.sendAnimation(
            this.targetPlayer.id,
            'https://media.giphy.com/media/12eLy0DOnVE6mA/giphy.gif',
            {
                caption: 'О нет! Тебя превартили в тыкву...'
            }
        )

        JackOLantern.game.bot.sendMessage(
            this.player.id,
            `${highlightPlayer(this.targetPlayer)} успешно превращён в тыкву.`
        )
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, JackOLantern.game.players);
        this.choiceMsgEditText();
    }
}
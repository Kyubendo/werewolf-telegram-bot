import {RoleBase} from "../RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";

export class Thief extends RoleBase {
    roleName = "Вор 😈";
    startMessageText = `Ты ${this.roleName}! Тебе нравится воровать жизни людей. Каждую ночь можно выбрать того, ` +
        `у кого хочешь украсть. Если тебе повезет, тебе удастся украсть его роль, и вместо этого он станет вором!`
    weight = () => 4; // change?

    action = () => {
        if (Thief.game.stage !== 'night') return;
        Thief.game.bot.sendMessage(this.player.id,
            'Чью роль ты хочешь украсть?',
            {
                reply_markup: generateInlineKeyboard(Thief.game.players,
                    true)
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }
}
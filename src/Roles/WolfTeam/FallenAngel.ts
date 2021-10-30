import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {wolfTeam} from "../../Utils/teams";
import {findPlayer} from "../../Game/findPlayer";

type DecisionType = 'kill' | 'protect';

export class FallenAngel extends RoleBase {
    roleName = 'Падший ангел 👼🐺';
    roleIntroductionText = () => '';
    startMessageText = () => 'Боль пробегает по твоему телу, ' +
        'когда твои белые крылья становятся черными. ' +
        'Сквозь боль трансформации ты борешься с собой и с тем злом, ' +
        'которое пытается тобой овладеть... ' +
        'Несколько часов - и все кончено. ' +
        'Ты встаешь, чтобы посмотреть на себя: ' +
        'ничего не осталось от твоей прежней божественной красоты. ' +
        'Ты стал Падшим Ангелом, союзником волков.'
    weight = () => -20; // can't drop at the start of the game anyway

    killOrProtect?: DecisionType;

    action = () => {
        if (!this.killOrProtect)
            FallenAngel.game.bot.sendMessage(
                this.player.id,
                'Что ты хочешь сегодня сделать?',
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Убить', callback_data: JSON.stringify({type: 'role', choice: 'kill'})}],
                            [{text: 'Защитить', callback_data: JSON.stringify({type: 'role', choice: 'protect'})}],
                        ]
                    }
                }
            ).then(msg => this.choiceMsgId = msg.message_id)
        else {
            if (this.killOrProtect === 'kill') {
                FallenAngel.game.bot.sendMessage(
                    this.player.id,
                    'Кого ты хочешь сегодня убить?',
                    {
                        reply_markup: generateInlineKeyboard(FallenAngel.game.players
                            .filter(player => player !== this.player
                                && player.isAlive
                                && !(wolfTeam.find(wolfTeamPlayer => player.role instanceof wolfTeamPlayer))))
                    }
                ).then(msg => this.choiceMsgId = msg.message_id)
            } else {
                FallenAngel.game.bot.sendMessage(
                    this.player.id,
                    'Кого ты хочешь сегодня защитить?',
                    {
                        reply_markup: generateInlineKeyboard(FallenAngel.game.players
                            .filter(player => player !== this.player
                                && player.isAlive
                                && wolfTeam.find(wolfTeamPlayer => player.role instanceof wolfTeamPlayer)))
                    }
                ).then(msg => this.choiceMsgId = msg.message_id)
            }
            this.killOrProtect = undefined;
        }
    }

    handleChoice = (choice?: string) => {
        if (choice === 'kill' || choice === 'protect') {
            this.killOrProtect = choice;
            this.choiceMsgEditText();
            this.action();
        } else {
            this.targetPlayer = findPlayer(choice, FallenAngel.game.players);
            super.choiceMsgEditText();
        }

    }

    choiceMsgEditText = () => {
        FallenAngel.game.bot.editMessageText(
            `Выбор принят: ${this.killOrProtect === 'kill' ? 'Убить' : 'Защитить'}.`,
            {
                message_id: this.choiceMsgId,
                chat_id: this.player.id,
            }
        )
    }
}

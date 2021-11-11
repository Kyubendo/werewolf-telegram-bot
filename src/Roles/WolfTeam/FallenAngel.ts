import {DeathType, RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Beauty, GuardianAngel, SerialKiller, Wolf} from "../index";
import {Player} from "../../Game";

type DecisionType = 'kill' | 'protect';

export class FallenAngel extends RoleBase {
    roleName = 'Падший ангел 👼🐺';
    startMessageText = () => 'Боль пробегает по твоему телу, ' +
        'когда твои белые крылья становятся черными. ' +
        'Сквозь боль трансформации ты борешься с собой и с тем злом, ' +
        'которое пытается тобой овладеть... ' +
        'Несколько часов - и все кончено. ' +
        'Ты встаешь, чтобы посмотреть на себя: ' +
        'ничего не осталось от твоей прежней божественной красоты. ' +
        'Ты стал Падшим Ангелом, союзником волков.'
    weight = () => -20; // can't drop at the start of the game anyway

    nightActionDone = false

    killOrProtect?: DecisionType;

    numberOfAttacks: number = 0;

    killMessage = () => ({
        text: {
            toChat: (deadPlayer: Player) => `${highlightPlayer(this.player)} повезло — ` +
                `сегодня ночью до него смогли добраться ни волки, ни сумасшедний маньяк. ` +
                `Однако, жители, собравшись, на утро ` +
                `всё же обнаружили бездыханное тело ${highlightPlayer(this.player)}. Кто же тогда его убил? ` +
                `Ответ стал ясен, когда один из жителей указал на разбросанные рядом с трупом чёрные перья. ` +
                `На этот раз атаковал ${this.roleName}! ${highlightPlayer(deadPlayer)} ` +
                `был(а) *${deadPlayer.role?.roleName}*`,
            toTarget: `О нет! Ты убил ${this.roleName}!`
        },
        gif: 'https://tenor.com/view/wings-fly-angel-open-wings-black-and-white-gif-17886279'
    })

    action = () => {
        this.targetPlayer = undefined;
        this.numberOfAttacks = 0;
        if (FallenAngel.game.players.find(player => player.role instanceof Wolf))
            FallenAngel.game.bot.sendMessage(
                this.player.id,
                'Что ты хочешь сегодня сделать?',
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{
                                text: 'Убить',
                                callback_data: JSON.stringify({type: 'role', choice: 'kill'})
                            }],
                            [{
                                text: 'Защитить',
                                callback_data: JSON.stringify({type: 'role', choice: 'protect'})
                            }],
                            [{
                                text: 'Пропустить',
                                callback_data: JSON.stringify({type: 'role', choice: 'skip'})
                            }],
                        ]
                    }
                }
            ).then(msg => this.choiceMsgId = msg.message_id)
        else {
            this.killOrProtect = 'kill';
            this.nextAction();
        }
    }

    nextAction = () => {
        if (this.killOrProtect === 'kill') {
            FallenAngel.game.bot.sendMessage(
                this.player.id,
                'Кого ты хочешь сегодня убить?',
                {
                    reply_markup: generateInlineKeyboard(
                        FallenAngel.game.players
                            .filter(player => player !== this.player
                                && player.isAlive
                                && !(player.role instanceof Wolf)
                            )
                    )
                }
            ).then(msg => this.choiceMsgId = msg.message_id)
        } else {
            FallenAngel.game.bot.sendMessage(
                this.player.id,
                'Кого ты хочешь сегодня защитить?',
                {
                    reply_markup: generateInlineKeyboard(
                        FallenAngel.game.players
                            .filter(player => player !== this.player
                                && player.isAlive
                                && player.role instanceof Wolf
                            )
                    )
                }
            ).then(msg => this.choiceMsgId = msg.message_id)
        }
    }

    actionResolve = () => {
        if (this.targetPlayer) {
            if (this.killOrProtect === 'kill') // kill
                if (this.targetPlayer.guardianAngel?.role instanceof GuardianAngel) {
                    this.handleGuardianAngel(this.player);
                    return;
                } else if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player)
                    this.loveBind(this.targetPlayer)
                else
                    this.targetPlayer.role?.onKilled(this.player);
            else // protect
                this.targetPlayer.guardianAngel = this.player;
        }
    }

    actionResult = () => {
        if (this.targetPlayer?.role && this.killOrProtect === 'protect' && !this.numberOfAttacks) {
            GuardianAngel.game.bot.sendMessage(
                this.player.id,
                `Ты защищал волка ${highlightPlayer(this.targetPlayer)} сегодня ночью, ` +
                `но с ним ничего не случилось...`
            )
        }
        this.killOrProtect = undefined;
    }

    handleChoice = (choice?: string) => {
        if (choice === 'kill' || choice === 'protect') {
            this.killOrProtect = choice;
            this.choiceMsgEditText();
            this.nextAction();
        } else {
            this.targetPlayer = findPlayer(choice, FallenAngel.game.players);
            super.choiceMsgEditText();
            this.doneNightAction();
        }
    }

    handleDeath(killer?: Player, type?: DeathType): boolean {
        if (type === 'wolfCameToSerialKiller') {
            FallenAngel.game.bot.sendMessage(
                FallenAngel.game.chatId,
                `Ночью ангел ${highlightPlayer(this.player)} раз и навсегда пытался спасти от маньяка ` +
                ` дерев... Стоп что?! Волков?! ` +
                'А ангелок-то оказался падшим! ' +
                `В общем *${this.roleName}* пытался помочь волкам, ` +
                `но маньяк отрезал ${highlightPlayer(this.player)} его чёрные крылья! ` +
                'Неужто никто в этой деревне не сможет справиться с этим дьяволом во плоти... '
            )

            FallenAngel.game.bot.sendMessage(
                this.player.id,
                'Ты вышел на охоту, но сам оказался жертвой, ведь ты наткнулся на сумасшедшего маньяка. '
                + 'Перед тем как испробовать на тебе свою новую вилку, ' +
                'он отрезал тебе твои драгоценные чёрные крылья! Ты умер. Зря ты перешёл на тёмную сторону...'
            )

            this.player.isAlive = false;
            return true;
        } else
            return super.handleDeath(killer, type);
    }

    choiceMsgEditText = () => FallenAngel.game.bot.editMessageText(
        `Выбор принят — ${this.killOrProtect === 'kill'
            ? 'Убить'
            : this.killOrProtect === 'protect'
                ? 'Защитить'
                : 'Пропустить'}.`,
        {
            message_id: this.choiceMsgId,
            chat_id: this.player.id,
        }
    )
}

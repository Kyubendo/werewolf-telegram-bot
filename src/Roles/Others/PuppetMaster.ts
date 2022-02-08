import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {playerLink} from "../../Utils/playerLink";
import {findPlayer} from "../../Game/findPlayer";
import {Arsonist, Cupid, Undertaker, Wolf} from "..";
import {Player} from "../../Game";
import {firstNightChoiceRoles, nightChoiceRoles} from "../../Utils/teams";

export class PuppetMaster extends RoleBase {
    roleName = 'Кукловод 🕴';
    startMessageText = () => 'Мастер манипуляций. ' +
        'Каждую ночь ты можешь применять свои навыки манипулирования, ' +
        'чтобы другой игрок или группа игроков сделала то, что хочешь ты, пока не останешься один.'

    nightActionDone = false;

    puppetTargetPlayer?: Player;
    puppetTargetPlayer2?: Player;

    action = () => this.puppetChoice();

    puppetChoice = () => {
        this.puppetTargetPlayer = undefined;
        this.puppetTargetPlayer2 = undefined;

        PuppetMaster.game.bot.sendMessage(
            this.player.id,
            'Чьими действиями ты хочешь управлять этой ночью?',
            {
                reply_markup: generateInlineKeyboard(
                    PuppetMaster.game.players.filter(player => player !== this.player && player.isAlive)
                )
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    puppetTargetPlayerChoice = async () => {
        if (!this.targetPlayer?.role) return;

        const deadPlayers = PuppetMaster.game.players.filter(player => !player.isAlive);
        if ((nightChoiceRoles.find(nightChoiceRole => this.targetPlayer?.role instanceof nightChoiceRole)
                || (PuppetMaster.game.dayCount === 0 && firstNightChoiceRoles
                    .find(firstNightChoiceRole => this.targetPlayer?.role instanceof firstNightChoiceRole))
                || this.targetPlayer.role instanceof Undertaker && !deadPlayers.length)
            && !this.targetPlayer.daysLeftToUnfreeze) {
            let playersArray;

            if (this.targetPlayer.role instanceof Undertaker)
                playersArray = deadPlayers;
            else if (this.targetPlayer.role instanceof Cupid)
                playersArray = PuppetMaster.game.players
                    .filter(player => player.isAlive);
            else
                playersArray = PuppetMaster.game.players
                    .filter(player => player !== this.targetPlayer && player.isAlive)

            await PuppetMaster.game.bot.sendMessage(
                this.player.id,
                'Кого ты хочешь выбрать?',
                {reply_markup: generateInlineKeyboard(playersArray, false)}
            ).then(msg => this.actionMsgId = msg.message_id)
        } else {
            await PuppetMaster.game.bot.sendMessage(
                this.player.id,
                'Ты понимаешь, ' +
                `что не можешь управлять действиями ${playerLink(this.targetPlayer)} этой ночью... ` +
                `Возможно он(а) спит. Какая досада.`
            )
            this.doneNightAction()
        }
    }

    cupidSecondTargetPlayerChoice = async () => {
        if (!this.targetPlayer?.role || !this.puppetTargetPlayer?.role) return;

        await PuppetMaster.game.bot.sendMessage(
            this.player.id,
            'Кого ещё ты хочешь выбрать?',
            {
                reply_markup: generateInlineKeyboard(
                    PuppetMaster.game.players
                        .filter(player => player !== this.puppetTargetPlayer && player.isAlive), false
                )
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.targetPlayer?.role || !this.puppetTargetPlayer) return;

        if (this.targetPlayer.role instanceof Wolf) {
            this.targetPlayer.role.findAllies().forEach(wolf => {
                if (wolf.role?.targetPlayer)
                    wolf.role.targetPlayer = undefined;
                this.puppetTargetPlayer && PuppetMaster.game.bot.sendMessage(wolf.id,
                    'Сильная сущность захватила разум всей вашей стаи ночью. ' +
                    `И какой бы выбор вы не сделали до этого, ` +
                    `${this.roleName} выбрал ${playerLink(this.puppetTargetPlayer)} за вас!`)
            })
        }

        this.targetPlayer.role.targetPlayer = this.puppetTargetPlayer;

        if (this.targetPlayer.role instanceof Cupid && this.puppetTargetPlayer2) {
            this.targetPlayer.role.targetPlayer2 = this.puppetTargetPlayer2;
            await PuppetMaster.game.bot.sendMessage(this.targetPlayer.id,
                'Сильная сущность захватила твой разум ночью. ' +
                `И какой бы выбор ты не сделал(а) до этого, ` +
                `${this.roleName} выбрал ${playerLink(this.puppetTargetPlayer)} ` +
                `и ${playerLink(this.puppetTargetPlayer2)} за тебя!`)
        } else if (!(this.targetPlayer.role instanceof Arsonist && this.targetPlayer.role.burn))
            await PuppetMaster.game.bot.sendMessage(this.targetPlayer.id,
                'Сильная сущность захватила твой разум ночью. ' +
                `И какой бы выбор ты не сделал(а) до этого, ` +
                `${this.roleName} выбрал ${playerLink(this.puppetTargetPlayer)} за тебя!`)
    }

    handleChoice = (choice?: string) => {
        if (this.puppetTargetPlayer) {
            this.puppetTargetPlayer2 = findPlayer(choice, PuppetMaster.game.players);
            this.puppetTargetPlayer2 && RoleBase.game.bot.editMessageText(
                `Выбор принят — ${playerLink(this.puppetTargetPlayer2)}.`,
                {message_id: this.actionMsgId, chat_id: this.player.id}
            ).then(this.doneNightAction)
        } else if (this.targetPlayer) {
            this.puppetTargetPlayer = findPlayer(choice, PuppetMaster.game.players);
            this.puppetTargetPlayer && RoleBase.game.bot.editMessageText(
                `Выбор принят — ${playerLink(this.puppetTargetPlayer)}.`,
                {message_id: this.actionMsgId, chat_id: this.player.id}
            )
            if (this.targetPlayer.role instanceof Cupid)
                this.cupidSecondTargetPlayerChoice();
            else
                this.doneNightAction();
        } else {
            this.targetPlayer = findPlayer(choice, Cupid.game.players)
            this.choiceMsgEditText();
            this.puppetTargetPlayerChoice();
        }
    }
}
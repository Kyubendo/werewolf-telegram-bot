import {RoleBase} from "../Abstract/RoleBase";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {findPlayer} from "../../Game/findPlayer";
import {SerialKiller} from "./SerialKiller";
import {AlphaWolf} from "../WolfTeam/AlphaWolf";
import {OmegaWolf} from "./OmegaWolf";
import {Wolf} from "../WolfTeam/Wolf";
import {highlightPlayer} from "../../Utils/highlightPlayer";

export class SigmaWolf extends RoleBase {
    roleName = 'Сигма-волк 🐺💫';
    roleIntroductionText = () => `Ты ${this.roleName}. `
    startMessageText = () => 'Одинокий волк, пришедший из другой деревни в поисках стаи. ' +
        'Твоя цель - найти Альфа-волка и стать новым Альфа-волком с шансом 50% заразить жертву. ';
    weight = () => -6;

    action = () => {
        SigmaWolf.game.bot.sendMessage(
            this.player.id,
            'Кого ты хочешь проверить?',
            {
                reply_markup: generateInlineKeyboard(SigmaWolf.game.players
                    .filter(player => player !== this.player && player.isAlive))
            }
        ).then(msg => this.choiceMsgId = msg.message_id)
    }

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;

        if (this.targetPlayer.role instanceof SerialKiller) {
            this.onKilled(this.targetPlayer);
        } else if (this.targetPlayer.role instanceof AlphaWolf) {
            this.player.role = new AlphaWolf(this.player, this.player.role);
            if (this.player.role instanceof AlphaWolf)
                this.player.role.infectionChance = 0.5;

            const otherWolves = this.targetPlayer.role.findOtherWolfPlayers();

            SigmaWolf.game.bot.sendMessage(
                this.player.id,
                `Ты осторожно пробираешься в дом ${highlightPlayer(this.player)} и... Бинго! ` +
                `Ты находишь Альфа-волка ${highlightPlayer(this.targetPlayer)}. Ты бросаешь ему вызов. ` +
                (otherWolves && 'Вся стая собираеться посмотреть на ваш поединок. ') +
                `По итогам яростного сражения ты оказываешь абсолютным победителем, ` +
                `разорвав старого Альфа-волка ${highlightPlayer(this.targetPlayer)} на куски. ` +
                (otherWolves
                    ? 'Вся стая смотрит на тебя. Ты понимаешь, что теперь они будут следовать за тобой ' +
                    `несмотря ни на что. `
                    : `После победы ты ощущаешь небывалый прилив сил. `) +
                `Теперь ты ${this.targetPlayer.role.roleName}!\n` + this.targetPlayer.role.showOtherWolfPlayers()
            )

            this.targetPlayer.role = new OmegaWolf(this.player, this.player.role);
            this.targetPlayer.role.onKilled(this.player);

            SigmaWolf.game.bot.sendMessage(
                this.targetPlayer.id,
                `Прошлой ночью ${this.roleName} ${highlightPlayer(this.player)} ` +
                'появился перед тобой и вызвал тебя на бой. ' +
                'Ты отчаянно стремишься выжить, но твоей силы недостаточно. ' +
                'Твое тело разрывают на части, куски разбрасывают во все стороны. Ты мёртв.'
            )

            this.targetPlayer.role instanceof AlphaWolf && otherWolves
                .forEach(wolfPlayer => SigmaWolf.game.bot.sendMessage(
                    wolfPlayer.id,
                    `${wolfPlayer.role} ${highlightPlayer(this.player)} нашёл ` +
                    'твою стаю сегодня ночью и бросил вызов твоему вожаку! ' +
                    'После мучительного, ужасающего боя Сигма-волку без единой раны удается ' +
                    'победить Альфа-волка. Он объявляет себя новым Альфа-волком. ' +
                    `Твой старый ${this.targetPlayer?.role?.roleName} ` +
                    `${this.targetPlayer && highlightPlayer(this.targetPlayer)} умер.`
                ))
        } else if (this.targetPlayer.role instanceof Wolf) {
            SigmaWolf.game.bot.sendMessage(
                this.player.id,
                `Ты осторожно пробираешься в дом ${highlightPlayer(this.targetPlayer)}, ` +
                'готовясь убить Альфа-волка стаи, ' +
                `но ${highlightPlayer(this.targetPlayer)} — не Альфа-волк, а ${this.targetPlayer.role.roleName}, ` +
                `Ты объясняешь ему свою позицию, он всё прекрасно понимает, но отказывается привести тебя в стаю, ` +
                `опасаясь, что Альфа-волк посчитает его предателем.`
            )

            SigmaWolf.game.bot.sendMessage(
                this.targetPlayer.id,
                `${this.roleName} ${highlightPlayer(this.player)} внезапно ` +
                'появился у порога прошлой ночью. Его позиция понятна, намерения ясны. ' +
                'Он хочет стать новым лидером стаи. Однако, в твоей стае уже есть Альфа-волк, ' +
                'и ты не можешь привести его в стаю, опасаясь, ' +
                'что Альфа-волк посчитает тебя предателем.'
            )
        } else {
            SigmaWolf.game.bot.sendMessage(
                this.player.id,
                `Ты осторожно пробираешься в дом ${highlightPlayer(this.targetPlayer)}, ` +
                'готовясь убить Альфа-волка стаи, ' +
                `но ${highlightPlayer(this.targetPlayer)} — не волк, не говоря уже об Альфа-волке.`
            )
        }

        this.targetPlayer = undefined;
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, SigmaWolf.game.players)
        this.choiceMsgEditText();
    }
}
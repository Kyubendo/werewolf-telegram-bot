import {DeathType, RoleBase} from "../Abstract/RoleBase";
import {specialConditionSnowman} from "../../Utils/specialConditionTypes";
import {findPlayer} from "../../Game/findPlayer";
import {generateInlineKeyboard} from "../../Game/playersButtons";
import {playerLink} from "../../Utils/playerLink";
import {Wolf} from "../WolfTeam/Wolf";
import {Player} from "../../Player/Player";
import {SerialKiller} from "../Others/SerialKiller";

export class Snowman extends RoleBase {
    roleName = 'Снеговик ☃';
    startMessageText = () => 'Несмотря на то, что тебя постоянно ломают дети, ты все равно помогаешь селянам. ' +
        'Ты можешь воспользоваться частями своего тела, ' +
        'чтобы слепить снежок и заморозить непонравившихся тебе жителей! ' +
        'Учти, что после третьего броска от тебя ничего не останется и ты умрёшь...';
    weight = () => {
        const wolfCount = Snowman.game.players.filter(player => player.role instanceof Wolf).length
        return wolfCount
            ? (wolfCount === 1 ? 9.5 : 8)
            : 6.5;
    }

    actionAnnouncement = () => ({
        message: this.targetPlayer
            ? 'Все жители, получив праздничные открытки, собрались на площади. Селяни образовали полукруг напротив ' +
            `подозрительного снеговика — ${playerLink(this.player)}. ` +
            'Вдруг снеговик начинает разрывать свою снежную плоть и лепить ' +
            'из неё оружие, от которого у людей и волков кровь стынет в жилах (не считая снежного волка). ' +
            `${playerLink(this.player)} размахивается и кидает снежок в первого попавшегося! ` +
            `${playerLink(this.targetPlayer)} теперь заморожен!`
            : 'ERROR! Snowman-19',
        gif: 'https://media.giphy.com/media/SceEMK2IAePGU/giphy.gif'
    })

    specialCondition: specialConditionSnowman = {
        snowballs: 3
    }

    stealMessage = () => this.specialCondition.snowballs === 1
        ? `У тебя остался последний снежок. Целься метко, иначе можешь умереть напрасно...`
        : (`У тебя осталось ${this.specialCondition.snowballs} снежка. Помни о том, что ты сам состоишь из снега, ` +
            'и целься аккуратно.')

    action = () => {
        if (!this.specialCondition.snowballs) return;

        Snowman.game.bot.sendMessage(
            this.player.id,
            'В кого ты хочешь бросить снежок?',
            {
                reply_markup: generateInlineKeyboard(Snowman.game.players.filter(p => p !== this.player && p.isAlive))
            }
        ).then(msg => this.actionMsgId = msg.message_id)
    }

    actionResolve = async () => {
        if (!this.targetPlayer?.role) return;

        await Snowman.game.bot.sendAnimation(
            Snowman.game.chatId,
            this.actionAnnouncement().gif,
            {
                caption: this.actionAnnouncement().message
            }
        )
        this.targetPlayer.daysLeftToUnfreeze = 1;
        this.specialCondition.snowballs--;
        if (!this.specialCondition.snowballs)
            await this.onKilled(this.player, 'runOutOfSnow')
    }

    handleChoice = (choice?: string) => {
        this.targetPlayer = findPlayer(choice, Snowman.game.players);
        this.choiceMsgEditText();
    }

    async handleDeath(killer?: Player, type?: DeathType): Promise<boolean> {
        if ((killer?.role instanceof Wolf || killer?.role instanceof SerialKiller) && !type) {
            let text: string = killer.role.killMessage().text.toChat(this.player);
            if (killer?.role instanceof Wolf) {
                killer.role.findAllies().forEach(wolfPlayer => wolfPlayer.daysLeftToUnfreeze = 2);
                killer.daysLeftToUnfreeze = 2;
                text = `На утро мирные жители обнаруживает покусаного снеговика... ` +
                    `Волк оставил нетронутой только морковку! ` +
                    `После такого ужина волк будет всю следующую ночь отогреваться.`;
            } else if (killer?.role instanceof SerialKiller) {
                text = `На утро мирные жители замечают некоторые косметические изменения в дизайне снеговика. ` +
                    `У него из груди торчит нож, а на земле лежит нарезанная морковка. `;
            }

            await Snowman.game.bot.sendMessage(
                Snowman.game.chatId,
                text
            )

            await Snowman.game.bot.sendAnimation(
                this.player.id,
                killer.role.killMessage().gif,
                {
                    caption: killer.role.killMessage().text.toTarget
                }
            )

            this.player.isAlive = false;
            return true;
        } else if (type === 'runOutOfSnow') {
            await Snowman.game.bot.sendMessage(
                Snowman.game.chatId,
                `${playerLink(this.player, true)} буквально отдал всего себя ради победы селян, ` +
                `метая снежки куда попало. ` +
                `Теперь от него осталась только лужица...`
            )

            await Snowman.game.bot.sendMessage(
                this.player.id,
                `Только что ты бросил свой последний снежок и от тебя больше ничего не осталось... Ты мёртв!`
            )

            this.player.isAlive = false;
            return true;
        }
        return super.handleDeath(killer, type);
    }
}
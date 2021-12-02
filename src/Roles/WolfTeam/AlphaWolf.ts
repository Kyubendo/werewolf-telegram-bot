import {playerLink} from "../../Utils/playerLink";
import {Beauty, Cursed, GuardianAngel, Wolf} from "../index";
import {DeathType, Player} from "../../Game";

export class AlphaWolf extends Wolf {
    roleName = 'Альфа-волк 🐺⭐';
    roleIntroductionText = () => `Ты ${this.roleName} - источник всех бедствий!`
    startMessageText = () => 'Твои укусы передают проклятие, обращающее человека в волка. ' +
        'По ночам ты можешь выбрать человека, а затем атаковать и убить его, но пока ты жив, ' +
        'твои жертвы имеют 25% шанса стать волком.'
        + this.showOtherWolfPlayers();
    weight = () => -13;

    actionResolve = async () => {
        if (!this.targetPlayer?.role) return;

        if (this.targetPlayer.guardianAngel?.role instanceof GuardianAngel) {
            await this.handleGuardianAngel(this.player);
            return;
        }

        if (this.targetPlayer.role instanceof Beauty && this.targetPlayer.lover !== this.player) {
            await this.player.loveBind(this.targetPlayer);
            return;
        }

        const currentTargetHandleDeath = this.targetPlayer.role.handleDeath.bind(this.targetPlayer.role)
        this.targetPlayer.role.handleDeath = async (killer?: Player, deathType?: DeathType) => {
            if (!this.targetPlayer
                || Math.random() >= .25
                || this.targetPlayer.role instanceof Cursed) return currentTargetHandleDeath(killer, deathType);

            await AlphaWolf.game.bot.sendMessage(
                this.targetPlayer.id,
                `Ты был(а) атакован(а) волками, но ${this.roleName} избрал тебя. ` +
                'Вместо того, чтобы быть убитым(ой), ты был(а) заражен(а)... ' +
                'И завтрашней ночью превратишься в' +
                ((this.targetPlayer.role instanceof GuardianAngel)
                    ? '... Падшего Ангела!'
                    : ' волка!')
            )

            const wolfPlayers = AlphaWolf.game.players.filter(player => player.role instanceof Wolf);

            wolfPlayers.forEach(player =>
                    this.targetPlayer && AlphaWolf.game.bot.sendMessage(
                        player.id,
                        `Как только волками был(а) атакован(а) ${playerLink(this.targetPlayer)}, ` +
                        `${playerLink(this.player)} остановил всех. ` +
                        `${playerLink(this.player, true)} рассказал стае, ` +
                        `что ${playerLink(this.targetPlayer)} должен(на) ` +
                        'присоединиться к стае вместо того, ' +
                        `чтобы умереть, и стая оставила ${playerLink(this.targetPlayer)} с инфекцией.\n`
                        + ((this.targetPlayer.role instanceof GuardianAngel)
                            ? 'Следующей ночью у вас появится союзник, которого сложно переоценить... ' +
                            'Он отбросит всё святое, чтобы вступить в волчьи ряды. ' +
                            'Конечно же речь идёт о Падшем Ангеле!'
                            : 'Он(а) станет волком завтра ночью.')
                    )
            )

            this.targetPlayer.infected = true;

            return false;
        }

        await this.targetPlayer.role?.onKilled(this.player);
    }
}
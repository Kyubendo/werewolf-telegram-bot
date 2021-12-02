import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Beauty, Cursed, GuardianAngel, Wolf} from "../index";
import {DeathType, Player} from "../../Game";

export class AlphaWolf extends Wolf {
    roleName = 'Альфа-волк 🐺⭐️';
    roleIntroductionText = () => `Ты ${this.roleName} - источник всех бедствий!`
    startMessageText = () => 'Твои укусы передают проклятие, обращающее человека в волка. ' +
        'По ночам ты можешь выбрать человека, а затем атаковать и убить его, но пока ты жив, ' +
        'твои жертвы имеют 25% шанса стать волком.'
        + this.sendAlliesMessage();
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
                'И завтрашней ночью превратишься в волка!'
            )

            const wolfPlayers = AlphaWolf.game.players.filter(player => player.role instanceof Wolf);

            wolfPlayers.forEach(player =>
                    this.targetPlayer && AlphaWolf.game.bot.sendMessage(
                        player.id,
                        `Как только волками был(а) атакован(а) ${highlightPlayer(this.targetPlayer)}, ` +
                        `${highlightPlayer(this.player)} остановил всех, будучи Альфа Волком. ` +
                        `*${this.roleName}* ${highlightPlayer(this.player)} рассказал стае, ` +
                        `что ${highlightPlayer(this.targetPlayer)} должен(на) ` +
                        'присоединиться к стае вместо того, ' +
                        `чтобы умереть, и стая оставила ${highlightPlayer(this.targetPlayer)} с инфекцией. ` +
                        'Он(а) станет волком завтра ночью.'
                    )
            )

            this.targetPlayer.infected = true;

            return false;
        }

        await this.targetPlayer.role?.onKilled(this.player);
    }
}
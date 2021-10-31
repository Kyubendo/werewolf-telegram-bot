import {Wolf} from "./Wolf";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {Player} from "../../Player/Player";

export class AlphaWolf extends Wolf {
    roleName = 'Альфа-волк 🐺⚡';
    roleIntroductionText = () => `Ты ${this.roleName} - источник всех бедствий! `
    startMessageText = () => 'Твои укусы передают проклятие, обращающее человека в волка. ' +
        'По ночам ты можешь выбрать человека, а затем атаковать и убить его, но пока ты жив, ' +
        'твои жертвы имеют 25% шанса стать волком.'
    weight = () => 13;

    actionResolve = () => {
        if (!this.targetPlayer?.role) return;

        const currentTargetHandleDeath = this.targetPlayer.role.handleDeath;
        this.targetPlayer.role.handleDeath = (killer?: Player): boolean => {
            if (!this.targetPlayer || Math.random() >= 0.25) return currentTargetHandleDeath(killer);

            AlphaWolf.game.bot.sendMessage(
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
                        `чтобы умереть, и стая оставила ${this.targetPlayer} с инфекцией. ` +
                        'Он(а) станет волком завтра ночью.'
                    )
            )

            this.targetPlayer.infected = true;

            return false;
        }
    }
}
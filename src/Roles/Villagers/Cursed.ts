import {Player} from "../../Player/Player";
import {Wolf} from "../WolfTeam/Wolf";
import {highlightPlayer} from "../../Utils/highlightPlayer";
import {DeathType} from "../../Game";
import {RoleBase} from "../"

export class Cursed extends RoleBase {
    roleName = 'Проклятый 😾';
    startMessageText = () => 'Сейчас ты обычный смертный, но если волки выберут тебя съесть, ты станешь одним из них.';
    weight = () => {
        const wolvesAmount = Cursed.game.players.filter(player => player.role instanceof Wolf).length;
        return (wolvesAmount ? 1 - wolvesAmount : 1)
    }

    handleDeath(killer?: Player, type?: DeathType) {
        if (killer?.role instanceof Wolf && !type) {
            Cursed.game.players.filter(player => player.role instanceof Wolf && player.isAlive)
                .forEach(player => Cursed.game.bot.sendMessage(
                    player.id,
                    `${highlightPlayer(this.player)} был(а) ${this.player.role?.roleName}, ` +
                    `поэтому он(а) теперь один(на) из вас! Поздравляем нового волка.`
                ));

            this.player.role = new Wolf(this.player, this.player.role);

            if (this.player.role instanceof Wolf)
                Cursed.game.bot.sendMessage(this.player.id,
                    'Тебя попытался убить волк! НО ты Проклятый, поэтому теперь ты один из них...' // GIF
                    + this.player.role.showOtherWolfPlayers()
                );
            return false;
        } else {
            return super.handleDeath(killer, type);
        }
    }
}
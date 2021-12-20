import {playerLink} from "../../Utils/playerLink";
import {DeathType, Player} from "../../Game";
import {RoleBase, Wolf} from "../"

export class Cursed extends RoleBase {
    roleName = 'Проклятый 😾';
    startMessageText = () => 'Сейчас ты обычный смертный, но если волки выберут тебя съесть, ты станешь одним из них.';
    weight = () => {
        const wolvesAmount = Cursed.game.players.filter(player => player.role instanceof Wolf).length;
        return (wolvesAmount ? 1 - wolvesAmount : 1)
    }

    async handleDeath(killer?: Player, type?: DeathType) {
        if (killer?.role instanceof Wolf && !type) {
            Cursed.game.players.filter(player => player.role instanceof Wolf && player.isAlive)
                .forEach(player => Cursed.game.bot.sendMessage(
                    player.id,
                    `${playerLink(this.player)} был(а) ${this.player.role?.roleName}, ` +
                    `поэтому он(а) теперь один(на) из вас! Поздравляем нового волка.`
                ));

            this.player.role = new Wolf(this.player, this.player.role);

            if (this.player.role instanceof Wolf)
                await Cursed.game.bot.sendMessage(this.player.id,
                    'Тебя попытался убить волк! НО ты Проклятый, поэтому теперь ты один из них...' // GIF
                );

            await this.player.role.sendAlliesMessage?.(true)

            return false;
        } else {
            return super.handleDeath(killer, type);
        }
    }
}
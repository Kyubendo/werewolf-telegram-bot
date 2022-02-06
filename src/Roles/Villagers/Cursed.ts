import {DeathType, Player} from "../../Game";
import {RoleBase, RoleWeights, Wolf} from "../"

export class Cursed extends RoleBase {
    roleName = 'Проклятый 😾';
    startMessageText = () => 'Сейчас ты обычный смертный, но если волки выберут тебя съесть, ты станешь одним из них.';
    weight = (w: RoleWeights) => {
        const wolvesAmount = Cursed.game.players.filter(player => player.role instanceof Wolf).length;
        this.activeWeight = wolvesAmount ? 'conditionWeight' : 'baseWeight';
        const activeWeight = w[this.activeWeight];

        this.activeWeightCoefficient = 'weightCoefficient';
        const activeWeightCoefficient = w[this.activeWeightCoefficient];
        this.weightCoefficientVariable = wolvesAmount;

        if (activeWeight === null || activeWeightCoefficient === null) throw 'ERR Cursed 17';

        if (wolvesAmount)
            return activeWeight - activeWeightCoefficient * wolvesAmount;
        else
            return activeWeight;
    }

    async handleDeath(killer?: Player, type?: DeathType) {
        if (killer?.role instanceof Wolf && !type) {
            this.player.role = new Wolf(this.player, this.player.role);

            if (this.player.role instanceof Wolf)
                await Cursed.game.bot.sendAnimation(this.player.id,
                    'https://media.giphy.com/media/79SufGBHLu4HYK13IE/giphy.gif',
                    {
                        caption: `Тебя попытался убить волк! ` +
                            `НО ты ${this.player.role.previousRole?.roleName}, поэтому теперь ты один из них...`
                    }
                );

            await this.player.role.sendAlliesMessage?.(true)

            return false;
        } else {
            return super.handleDeath(killer, type);
        }
    }
}
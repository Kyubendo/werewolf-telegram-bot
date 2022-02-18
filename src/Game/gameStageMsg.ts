import {Game} from "./Game";
import {playerLink} from "../Utils/playerLink";

export const gameStageMsg = (game: Game) => {
    switch (game.stage) {
        case "night":
            if (game.sandmanAbility)
                return 'Настала ночь! Но, так как этим днём Морфей 💤 заколдовал односельчан свой мелодией, ' +
                    'все очень крепко спят.'
            return 'Наступила ночь! Все простые смертные легли спать, игроки ночи - настало ваше время!\n\n' +
                `У вас есть *${game.nightDuration / 1000}* секунд...`
        case 'day':
            return 'Настал день... Время протестовать, делать заявления и сражаться за справедливость!\n\n' +
                `У вас есть *${game.dayDuration / 1000}* секунд...\n\n` +
                `День *№${game.dayCount}*`;
        case 'lynch':
            const activeMonarchs = game.lynch?.getActiveMonarchs();
            const activePacifists = game.lynch?.getActivatedPacifists();
            if (activePacifists?.length)
                return `Так как ${activePacifists[0].role?.roleName} провёл ` +
                    'демонстрацию во имя любви и мира, селяне решают никого не казнить.';
            else if (activeMonarchs?.length)
                return `${activeMonarchs[0].role?.roleName} раскрылся, так что он решит, кто умрёт сегодня!\n` +
                `${playerLink(activeMonarchs[0])}, у тебя есть *${game.lynchDuration / 1000}* секунд.`;
            else
                return 'Все селяне пришли на городское собрание, чтобы сделать выбор, ' +
                    'кого же будут сегодня казнить!\n\n' +
                    `Есть *${game.lynchDuration / 1000}* секунд, чтобы сделать выбор!`;
        default:
            return 'gameStage default case'
    }
}
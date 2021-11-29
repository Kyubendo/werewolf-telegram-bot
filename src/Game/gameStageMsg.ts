import {Game} from "./Game";
import {highlightPlayer} from "../Utils/highlightPlayer";

export const gameStageMsg = (game: Game) => {
    switch (game.stage) {
        case "night":
            return 'Наступила ночь! Все простые смертные легли спать, игроки ночи - настало ваше время!\n\n' +
                `У вас есть *${game.nightDuration / 1000}* секунд...`
        case 'day':
            return 'Настал день... Время протестовать, делать заявления и сражаться за справедливость!\n\n' +
                `У вас есть *${game.dayDuration / 1000}* секунд...\n\n` +
                `День *№${game.dayCount}*`;
        case 'lynch':
            const activeMonarchs = game.lynch?.getActiveMonarchs();
            const activePacifist = game.lynch?.checkActivePacifist();
            if (activePacifist)
                return `Так как ${activePacifist.role?.roleName} провёл ` +
                    'демонстрацию во имя любви и мира, селяне решают никого не казнить.';
            else if (activeMonarchs?.length)
                return `${activeMonarchs[0].role?.roleName} раскрылся, так что он решит, кто умрёт сегодня!\n` +
                `${highlightPlayer(activeMonarchs[0])}, у тебя есть *${game.lynchDuration / 1000}* секунд.`;
            else
                return 'Все селяне пришли на городское собрание, чтобы сделать выбор, ' +
                    'кого же будут сегодня казнить!\n\n' +
                    `Есть *${game.lynchDuration / 1000}* секунд, чтобы сделать выбор!`;
        default:
            return 'gameStage default case'
    }
}
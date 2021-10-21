import {GameStage} from "./Game";

export const gameStageMsg = (stage: GameStage) => {
    switch (stage) {
        case "night":
            return 'Наступила ночь! Все простые смертные легли спать, игроки ночи - настало ваше время! \n' +
                'У вас есть 120 секунд...'
        case 'day':
            return 'Настал день... Время протестовать, делать заявления и сражаться за справедливость!';
        case 'lynch':
            return 'Все селяне пришли на городское собрание, чтобы сделать выбор, кого же будут сегодня казнить! ';
            //Есть ${120} секунд, чтобы сделать выбор!
    }
}
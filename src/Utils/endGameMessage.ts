import {Win} from "../Game/checkEndGame";

export const endGameMessage: { [type in Win]: { text: string, gif: string } } = {
    serialKiller: {
        text: 'Последним оставшимся в живых стал Серийный Убийца! Кажется, он выиграл!',
        gif: 'https://media.giphy.com/media/4MUx7BRJEZh6veeFym/giphy.gif',
    },
    wolves: {
        text: 'Волки выиграли!',
        gif: 'https://c.tenor.com/jsmJrmp_IbYAAAAC/howl-breaking-dawn.gif',
    },
    villagers: {
        text: 'Селяне выиграли!',
        gif: 'https://c.tenor.com/-HtgekCqZt0AAAAd/minecraft-villager.gif',
    },
    nobody: {
        text: 'Все в деревне мертвы... ' +
            'Здесь больше нет ничего, кроме мертвых тел. Никто не выиграл, кроме стервятников.',
        gif: 'https://media.giphy.com/media/mXnu6HiBvOckU/giphy.gif',
    },
    suicide: {
        text: 'О нет! Вы казнили Самоубийцу! Он выиграл игру...',
        gif: 'https://media.giphy.com/media/mXnu6HiBvOckU/giphy.gif',
    },
    lovers: {
        text: 'Настоящая любовь побеждает! Любовники выиграли!',
        gif: 'https://media.giphy.com/media/M2zS4fBQbxZReOhlTa/giphy.gif' // Note: placeholder
    },
    jack: {
        text: 'Теперь село не отличить от тыквенной грядки... Все преваритились в тыквы! Победа Джека!',
        gif: 'https://media.giphy.com/media/rtgu0LxGT0R56/giphy.gif'
    },

}


import {Win} from "../Game/checkEndGame";

export const endGameMessage: { [type in Win]: { text: string, gif: string } } = {
    serialKiller: {
        text: 'Последним в живых остался Серийный Убийца! Кажется, он выиграл!',
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
            'Здесь больше нет ничего, кроме мёртвых тел. Никто не выиграл, кроме стервятников.',
        gif: 'https://media.giphy.com/media/g01ZnwAUvutuK8GIQn/giphy.gif',
    },
    suicide: {
        text: 'О нет! Вы казнили Самоубийцу/ Он выиграл игру...',
        gif: 'https://media.giphy.com/media/3ornka9rAaKRA2Rkac/giphy.gif',
    },
    lovers: {
        text: 'Настоящая любовь побеждает! Любовники выиграли!',
        gif: 'https://media.giphy.com/media/M2zS4fBQbxZReOhlTa/giphy.gif'
    },
    jack: {
        text: 'Теперь село не отличить от тыквенной грядки... Все преваритились в тыквы! Победа Джека!',
        gif: 'https://media.giphy.com/media/rtgu0LxGT0R56/giphy.gif'
    },
    arsonist: {
        text: 'Слышно лишь потрескивание пламени — вся деревня в огне. ' +
            'Только поджигатель сидит посреди села, довольно улыбаясь.',
        gif: 'https://media.giphy.com/media/IguL9zRYV20X1QeKuV/giphy.gif'
    },
    puppetMaster: {
        text: 'Игроки и не заметили как переубивали друг друга, ' +
            'пока злой гений успешно манипулировал ими как куклами на ниточках. На этот раз победа за Кукловодом.',
        gif: 'https://media.giphy.com/media/AEV3pbD81Pzyye0SRs/giphy.gif'
    }
}


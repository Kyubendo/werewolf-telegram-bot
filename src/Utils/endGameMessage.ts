import {Win} from "../Game/checkEndGame";

export const endGameMessage: { [type in Win]: { text: string, gif: string } } = {
    serialKiller: {
        text: 'Серийный убийца выиграл!',
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
        text: 'Никто не выиграл!',
        gif: 'https://media.giphy.com/media/Wxvp5LxtF0LTniwbVR/giphy.gif',
    },
    suicide: {
        text: 'Самоубийца выиграл!',
        gif: 'https://media.giphy.com/media/3ornka9rAaKRA2Rkac/giphy.gif',
    }
}


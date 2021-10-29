import {Win} from "../Game/checkEndGame";

export const endGameMessage: { [type in Win]: { text: string, gif: string } } = {
    serialKiller: {
        text: 'Серийный убийца выиграл!',
        gif: 'https://media.giphy.com/media/mXnu6HiBvOckU/giphy.gif',
    },
    wolves: {
        text: 'Волки выиграли!',
        gif: 'https://media.giphy.com/media/mXnu6HiBvOckU/giphy.gif',
    },
    villagers: {
        text: 'Селяне выиграли!',
        gif: 'https://media.giphy.com/media/mXnu6HiBvOckU/giphy.gif',
    },
    nobody: {
        text: 'Никто не выиграл!',
        gif: 'https://media.giphy.com/media/mXnu6HiBvOckU/giphy.gif',
    },
    suicide: {
        text: 'Самоубийца выиграл!',
        gif: 'https://media.giphy.com/media/mXnu6HiBvOckU/giphy.gif',
    }
}


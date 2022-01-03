const info =
    {
        villager: () => ({
            roleName: 'Селянин 👱',
            team: 'Селяне',
            weight: '1',
            winCondition: 'в живых не осталось волков, поджигателя и серийного убицы.',
        }),
        traitor: () => ({
            ...info.villager(),
            roleName: 'Предатель 🖕',
            weight: '-1',
            notes: [
                'Может выпасть, только если есть волк.',
                'Если в живых не остаётся ни одного волка, превращается в волка.',
                'Провидец видит его либо селянином(50%), либо волком(50%).',
            ],
        }),
        beauty: () => ({
            ...info.villager(),
            roleName: 'Красавица 💅',
            weight: '0.5',
            notes: [
                'Если какая-то ночная роль попытается навестить или ' +
                'убить тебя, вместо этого он(а) полюбит тебя',
            ],
        }),

        beholder: () => ({
            ...info.villager(),
            roleName: 'Очевидец 👁',
            weight: 'Если есть провидец, то 4.5, если нет провидца, то 2',
            notes: [
                'Очевидец видит есть провидец в игре или нету.', 
                'Очевидец увидит, если ученик провидца займет место своего учителя'
        ],
        }),

        apprenticeSeer: () => ({
            ...info.villager(),
            roleName: 'Ученик провидца 🙇‍♂️',
            weight: '5.5',
            notes: [
                'Если Провидец умрет, ученик займет его место'
            ]
        }),

        blackSmith: () => ({
            ...info.villager(),
            roleName: 'Кузнец ⚒',
            weight: 'Если есть Волк, то 8, если есть Предатель или Дикий то 4, в других случаях 3',
            dayAction: 'Разбрасывает серебрянную пыль повсюду на землю, тем самым защищая деревню от волков',
            notes: [
                'При выполнении активного действия вскрывает свою роль другим игрокам.',
            ]
        }),

        clumsyGuy: () => ({
            ...info.villager(),
            roleName: 'Недотёпа 🤕',
            weight: '0.5',
            notes: ['Имеет 50% шанс проголосовать за случайного игрока'],
        }),

        cowboy: () => ({
            ...info.villager(),
            roleName: 'Ковбой 🤠',
            weight: '4.5',
            notes: ['Если ковбой умирает, то может застрелить кого-то из игроков'],
        }),
        
        cupid: () => ({
            ...info.villager(),
            roleName: 'Купидон 🏹',
            weight: '2',
            notes: [
                'Может связать двух игроков любовными узами, если один из них погибнет,' +
                'то другой умрет от печали',
            ],
        }),

        cursed: () => ({
            ...info.villager(),
            roleName: 'Проклятый 😾',
            weight: 'Если есть волки, то вес равняется 1 - количество волков. Если волков нет, то вес равняется 1',
            notes: [
                'Изначально играет за команду села, но если проклятого кусает волк, то он становится волком',
            ]  
        }),

        detective: () => ({
            ...info.villager(),
            roleName: 'Детектив 🕵️',
            weight: '7',
            dayAction: 'Выбирает игрока. Перед голосованием узнает его роль',
            notes: ['Если детектив смотрит волка, то волк узнает об этом ']
        }),

        drunk: () => ({
            ...info.villager(),
            roleName: 'Пьяница 🍺',
            weight: 'Если в игре есть волк, то вес равняется 3. Если волка нет, то вес равняется 1',
            notes: ['Когда волк убивает пьяницу, у него пропадает возможность убивать на следующую ночь'],
        }),

        fool: () => ({
            ...info.villager(),
            roleName: 'Дурак 🃏',
            weight: '4',
            notes: [
                'Дурак думает, что он провидец.',
                'Имеет 50% шанс увидить верную роль игрока, и 50% шанс увидить любую роль из этой игры, кроме правильной и своей.',
                'Видит Ликана Селом, Лесника Волком', 
                'Имеет 50% шанс увидеть Предателя волком и 50% шанс увидеть Предателя Селом'],
        }),

        guardianAngel: () => ({
            ...info.villager(),
            roleName: 'Ангел-хранитель 👼',
            weight: '6.5',
            nightAction: 'Выберает игрока. Если его попытаются убить, то убийцу ждет неудача',
            notes: ['Если у ангела получилось спасти игрока, он увидит, что его кто-то спас']
        }),

        gunner: () => ({
            ...info.villager(),
            roleName: "Стрелок 🔫",
            weight: '6',
            dayAction: 'Выбирает игрока, в которого хочет выстрилить.',
            notes: ['После убийства все игроки узнают, кто стрелок', 'Убивает выбранного игрока, показывая его роль другим игрокам']
        }),

        harlot: () => ({
            ...info.villager(),
            roleName: "Блудница 💋",
            weight: '4.5',
            nightAction: 'Выбирает игрока. Вместе они проведут превосходную ночь, которую никогда не забудут.',
            notes: [
                'Если выберет волка или серийного убийцу, то будет жестоко убита',
                'Если выберет кого-то другого, то этот игрок будет знать, что кто-то к нему пришходил ночью'
            ]
        }),

        mason: () => ({
            ...info.villager(),
            roleName: 'Каменщик 👷',
            weight: 'Если в игре каменщиков больше одного, то вес равняется 3 + количество каменщиков. Если каменщик один, то вес равзяется 1.',
            notes: ['Каждый каменщик знает в лицо других каменщиков']
        }),

        mayor: () => ({
            ...info.villager(),
            roleName: 'Мэр 🎖',
            weight: '4',
            dayAction: 'Мэр может раскрыть свою роль другим игрокам',
            notes: ['После раскрытия роли, голос мэра начинает расцениваться за два']
        }),

        monarch: () => ({
            ...info.villager(),
            roleName: 'Монарх 🤴',
            weight: '4',
            dayAction: 'Монарх может раскрыть свою роль другим игрокам',
            notes: ['После раскрытия роли, монарх получает на следующее голосоване право выбрать, кого повесить']
        }),

        oracle: () => ({
            ...info.villager(),
            roleName: 'Оракул 🧿',
            weight: 4,
            nightAction: 'Оракул может выбрать игрока и узнать кем он НЕ является.',
            notes: ['Оракул узнает роль кого-то другого в игре']
        }),

        pacifist: () => ({
            ...info.villager(),
            roleName: 'Пацифист ☮',
            weight: '2',
            dayAction: 'Может провести демонстрацию пацифизма, убрав тем самым следующее голосование за казнь',
            notes: ['Все игроки узнают, кто пацифист']
        }),

        princess: () => ({
            ...info.villager(),
            roleName: 'Принцесса 💍',
            weight: '2',
            notes: ['При попытке казнить принцессу, селяне узнают роль приговоренной и не будут никого казнить'] //Формулировка так себе, надо переделать будет
        }),

        sandman: () => ({
            ...info.villager(),
            roleName: 'Морфей 💤',
            weight: '6.5',
            dayAction: 'Может заставить всех уснуть, тем самым отменив все ночные действия',
            notes: ['Вскрывает свою роль другим игрокам.']
        }),

        seer: () => ({
            ...info.villager(),
            roleName: 'Провидец 👳',
            weight: '6.5',
            nightAction: 'Выбирает игрока. После окончания ночи узнает его роль.',
            notes: ['Провидец не может быть уверен, провидец он или дурак.']
        }),

        wildChild: () => ({
           ...info.villager(),
           roleName: 'Дикий ребёнок 👶',
           weigth: '-1',
           nightAction: 'Выбирает игрока. Если он умрет, дикий ребёнок станет волком',
           notes: ['Изначально играет за команду села.',
           'Условие победы за село: ' + info.villager().winCondition, //Так норм делать в заметках для ролей, которые могут становится злом?
           'Условие победы за волков: ' + info.wolf().winCondition]
        }),

        wiseElder: () => ({
            ...info.villager(),
            roleName: "Мудрец 📚",
            weight: '5',
            nightAction: 'Выбирает игрока. После окончания ночи узнает, может ли тот убивать',
        }),

        woodMan: () => ({
            ...info.villager(),
            roleName: 'Лесник 🧔‍♂‍🌚',
            weight: 'Если в игре есть провидец, то вес равняется -1. Если провидца нет, то вес равняется 1',
            notes: ['Провидец может видеть лесника волком.']
        }),

        wolf: () => ({
            roleName: 'Волк 🐺',
            team: 'Волки',
            weight: '-10',
            nightAction: 'Может выбрать одного из игроков и попытаться его съесть.',
            winCondition: 'Волков не меньше половины живых игроков.',
        }),
        lycan: () => ({
            ...info.wolf(),
            roleName: 'Ликан 🐺🌝',
            weight: 'Если есть провидец, то -12. Если нет провидца, то -10.',
            notes: ['Провидец видит ликана селянином']
        }),

        alphaWolf: () => ({
            ...info.wolf(),
            roleName: 'Альфа-волк 🐺⭐️',
            weight: '-12',
            nightAction: 'Может выбрать одного из игроков и попытаться его съесть.',
            notes: ['Имеет шанс 255 превратить свою жертву с члена стаи']
        }),

        prowler: () => ({
            ...info.wolf(),
            roleName: 'Сова 🦉',
            weight: '-4',
            nightAction: 'Каждую ночь может посмотреть в окно одного из игроков и узнать спит он или нет. Если же его съедят, ты увидишь всю стаю волков и узнаешь их имена',
            notes: ['Союзник волков. Победит, только если волков останется не меньше селян.']
        }),

        sorcerer: () => ({
            ...info.wolf(), 
            roleName: 'Колдунья 🔮',
            weight: '-3',
            nightAction: 'Выбирает игрока. Может узнать, является ли игрок волком или же провидцем',
            notes: ['Союзник волков. Победит, только если волков останется не меньше селян.']
        })
    }
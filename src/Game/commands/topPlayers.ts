import TelegramBot from "node-telegram-bot-api";
import {User} from "../../entity/User";
import {UserChat} from "../../entity/UserChat";

export const topPlayers = (bot: TelegramBot) => {
    bot.onText(/\/top_players/, async msg => {
        if (['channel', 'private'].includes(msg.chat.type) || !msg.from) return;

        const playersList = await User.createQueryBuilder('u')
            .select([
                'u.name "name"',
                'sum(p.won::int) * 100 / count(p."userId") winrate',
                'count(p.userId) count',
            ])
            .innerJoin('u.players', 'p')
            .innerJoin(UserChat, 'uc', 'uc.userId = u.id')
            .andWhere('uc.chatId=:chatId', {chatId: msg.from.id})
            .having('count(p.userId) > 9')
            .groupBy('name')
            .orderBy('winrate', 'DESC')
            .getRawMany()

        console.log(await User.createQueryBuilder('u')
            .select([
                'u.name "name"',
                'sum(p.won::int) * 100 / count(p."userId") winrate',
                'count(p.userId) count',
            ])
            .innerJoin('u.players', 'p')
            .innerJoin(UserChat, 'uc', 'uc.userId = u.id')
            .andWhere('uc.chatId=:chatId', {chatId: msg.from.id})
            .having('count(p.userId) > 9')
            .groupBy('name')
            .orderBy('winrate', 'DESC')
            .getSql())

        if (!playersList.length) {
            return
        }

        bot.sendMessage(
            msg.chat.id,
            playersList.map((p, i) => `${i + 1}. *${p.name}* — _${p.winrate}%_ (игр: ${p.count})`)
                .join('\n')
        )
    })
}

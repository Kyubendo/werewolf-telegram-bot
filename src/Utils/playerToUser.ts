import {Connection} from "typeorm";
import {User} from "../entity/User";

export const playerToUser = async (db: Connection, playerId: number) =>
    db.getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :id', {id: playerId})
        .getOne();

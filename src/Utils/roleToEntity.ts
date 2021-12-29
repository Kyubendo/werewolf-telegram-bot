import {Connection} from "typeorm";
import {RoleBase} from "../Roles";
import {Role} from "../entity/Role";

export const roleToEntity = async (db: Connection, role: RoleBase) => {
    let roleRecord = await db.getRepository(Role)
        .createQueryBuilder('role')
        .where('role.name = :name', {name: role.constructor.name})
        .getOne()
    if (!roleRecord) {
        roleRecord = new Role()
        roleRecord.name = role.constructor.name
        await db.manager.save(roleRecord)
    }
    return roleRecord
}
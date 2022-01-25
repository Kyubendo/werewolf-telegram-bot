import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import {RoleBase} from "../Roles";


@Entity()
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique: true})
    name!: string;

    @Column({type: 'float'})
    baseWeight!: number;

    @Column({nullable: true, type: 'float'})
    conditionWeight!: number | null;

    @Column({nullable: true, type: 'float'})
    conditionWeight2!: number | null;

    @Column({nullable: true, type: 'float'})
    weightCoefficient!: number | null;


    static async getFromObject(roleObj: RoleBase) {
        let role = await this.findOne({name: roleObj.constructor.name})
        if (!role) role = await this.create({name: roleObj.constructor.name}).save()
        return role
    }
}

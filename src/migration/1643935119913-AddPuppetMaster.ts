import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPuppetMaster1643935119913 implements MigrationInterface {
    name = 'AddPuppetMaster1643935119913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into role (name, "baseWeight")
            values ('PuppetMaster', -6)
            on conflict do nothing;
        `)

        await queryRunner.query(`
            update role
            set "baseWeight" = 5.5
            where "name" = 'ApprenticeSeer';
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}

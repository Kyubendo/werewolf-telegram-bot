import {MigrationInterface, QueryRunner} from "typeorm";

export class AddApprenticeSeer1644365201486 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            insert into role (name, "baseWeight")
            values ('ApprenticeSeer', 5.5)
            on conflict do nothing;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

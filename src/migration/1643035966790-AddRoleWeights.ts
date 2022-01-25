import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRoleWeights1643035966790 implements MigrationInterface {
    name = 'AddRoleWeights1643035966790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" ADD "baseWeight" double precision`);
        await queryRunner.query(`ALTER TABLE "role" ADD "conditionWeight" double precision`);
        await queryRunner.query(`ALTER TABLE "role" ADD "conditionWeight2" double precision`);
        await queryRunner.query(`ALTER TABLE "role" ADD "weightCoefficient" double precision`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "weightCoefficient"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "conditionWeight2"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "conditionWeight"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "baseWeight"`);
    }

}

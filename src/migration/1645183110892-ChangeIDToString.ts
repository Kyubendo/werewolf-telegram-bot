import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeIDToString1645183110892 implements MigrationInterface {
    name = 'ChangeIDToString1645183110892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player"
            DROP CONSTRAINT "FK_7687919bf054bf262c669d3ae21"`);
        await queryRunner.query(`ALTER TABLE "player"
            DROP CONSTRAINT "FK_0c5b1f1735debf5d77122155b34"`);
        await queryRunner.query(`ALTER TABLE "user_chat"
            DROP CONSTRAINT "FK_63f6e1b207375c35588c673843e"`);

        await queryRunner.query(`ALTER TABLE "user"
            ALTER COLUMN id TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "player"
            ALTER COLUMN "userId" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "user_chat"
            ALTER COLUMN "userId" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "player"
            ALTER COLUMN "loverUserId" TYPE character varying`);

        await queryRunner.query(`ALTER TABLE "player"
            ADD CONSTRAINT "FK_7687919bf054bf262c669d3ae21"
                FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chat"
            ADD CONSTRAINT "FK_63f6e1b207375c35588c673843e"
                FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player"
            ADD CONSTRAINT "FK_0c5b1f1735debf5d77122155b34"
                FOREIGN KEY ("loverUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player"
            DROP CONSTRAINT "FK_0c5b1f1735debf5d77122155b34"`);
        await queryRunner.query(`ALTER TABLE "user_chat"
            DROP CONSTRAINT "FK_63f6e1b207375c35588c673843e"`);
        await queryRunner.query(`ALTER TABLE "player"
            DROP CONSTRAINT "FK_7687919bf054bf262c669d3ae21"`);

        await queryRunner.query(`ALTER TABLE "player"
            ALTER COLUMN "loverUserId" TYPE integer USING "loverUserId"::integer`);
        await queryRunner.query(`ALTER TABLE "user_chat"
            ALTER COLUMN "userId" TYPE integer USING "userId"::integer`);
        await queryRunner.query(`ALTER TABLE "player"
            ALTER COLUMN "userId" TYPE integer USING "userId"::integer`);
        await queryRunner.query(`ALTER TABLE "user"
            ALTER COLUMN id TYPE integer USING "id"::integer`);

        await queryRunner.query(`ALTER TABLE "user_chat"
            ADD CONSTRAINT "FK_63f6e1b207375c35588c673843e" 
                FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player"
            ADD CONSTRAINT "FK_7687919bf054bf262c669d3ae21" 
                FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player"
            ADD CONSTRAINT "FK_0c5b1f1735debf5d77122155b34" 
                FOREIGN KEY ("loverUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

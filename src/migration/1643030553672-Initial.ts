import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1643030553672 implements MigrationInterface {
    name = 'Initial1643030553672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer NOT NULL, "name" character varying NOT NULL, "username" character varying, "rating" integer NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player" ("won" boolean NOT NULL, "userId" integer NOT NULL, "gameId" integer NOT NULL, "initialRoleId" integer, "finalRoleId" integer, "loverUserId" integer, CONSTRAINT "PK_1226352721f49996c9bf0bbe9d2" PRIMARY KEY ("userId", "gameId"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "duration" integer NOT NULL, "winner" character varying NOT NULL, "savedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_chat" ("chatId" bigint NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_50760d81e93441fd7358d3ccdde" PRIMARY KEY ("chatId", "userId"))`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_7687919bf054bf262c669d3ae21" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_973b3eafd9da201b93726c10f04" FOREIGN KEY ("initialRoleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_b0e5e518239d956c58d1f0ed8ce" FOREIGN KEY ("finalRoleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_0c5b1f1735debf5d77122155b34" FOREIGN KEY ("loverUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_chat" ADD CONSTRAINT "FK_63f6e1b207375c35588c673843e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_chat" DROP CONSTRAINT "FK_63f6e1b207375c35588c673843e"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_0c5b1f1735debf5d77122155b34"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_b0e5e518239d956c58d1f0ed8ce"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_973b3eafd9da201b93726c10f04"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_7dfdd31fcd2b5aa3b08ed15fe8a"`);
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_7687919bf054bf262c669d3ae21"`);
        await queryRunner.query(`DROP TABLE "user_chat"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

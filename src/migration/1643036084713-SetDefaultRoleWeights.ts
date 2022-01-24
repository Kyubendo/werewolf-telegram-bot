import {MigrationInterface, QueryRunner} from "typeorm";

export class SetDefaultRoleWeights1643036084713 implements MigrationInterface {
    name = 'SetDefaultRoleWeights1643036084713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`
        //     insert into role (name)
        //     values ('Seer');
        //     insert into role (name)
        //     values ('Lycan');
        //     insert into role (name)
        //     values ('WildChild');
        //     insert into role (name)
        //     values ('Gunner');
        //     insert into role (name)
        //     values ('Oracle');
        //     insert into role (name)
        //     values ('Arsonist');
        //     insert into role (name)
        //     values ('ClumsyGuy');
        //     insert into role (name)
        //     values ('AlphaWolf');
        //     insert into role (name)
        //     values ('Villager');
        //     insert into role (name)
        //     values ('Wolf');
        //     insert into role (name)
        //     values ('Drunk');
        //     insert into role (name)
        //     values ('Mason');
        //     insert into role (name)
        //     values ('Cupid');
        //     insert into role (name)
        //     values ('Undertaker');
        //     insert into role (name)
        //     values ('Traitor');
        //     insert into role (name)
        //     values ('Fool');
        //     insert into role (name)
        //     values ('Pacifist');
        //     insert into role (name)
        //     values ('Doppelganger');
        //     insert into role (name)
        //     values ('Blacksmith');
        //     insert into role (name)
        //     values ('Detective');
        //     insert into role (name)
        //     values ('SerialKiller');
        //     insert into role (name)
        //     values ('Thief');
        //     insert into role (name)
        //     values ('WiseElder');
        //     insert into role (name)
        //     values ('Sorcerer');
        //     insert into role (name)
        //     values ('Monarch');
        //     insert into role (name)
        //     values ('Mayor');
        //     insert into role (name)
        //     values ('Beholder');
        //     insert into role (name)
        //     values ('Princess');
        //     insert into role (name)
        //     values ('Suicide');
        //     insert into role (name)
        //     values ('Snowman');
        //     insert into role (name)
        //     values ('Cursed');
        //     insert into role (name)
        //     values ('Martyr');
        //     insert into role (name)
        //     values ('Sandman');
        //     insert into role (name)
        //     values ('Beauty');
        //     insert into role (name)
        //     values ('GuardianAngel');
        //     insert into role (name)
        //     values ('WoodMan');
        //     insert into role (name)
        //     values ('Prowler');
        //     insert into role (name)
        //     values ('Cowboy');
        //     insert into role (name)
        //     values ('Harlot');
        // `)

        await queryRunner.query(`
            update role
            set "baseWeight"      = 2,
                "conditionWeight" = 4.5
            where name = 'Beholder';

            update role
            set "baseWeight"      = 1,
                "conditionWeight" = 3,
                "coefficient"     = 1
            where name = 'Mason';

            update role
            set "baseWeight" = 7
            where name = 'Gunner';
        `);


        await queryRunner.query(`ALTER TABLE "role"
            ALTER COLUMN "baseWeight" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role"
            ALTER COLUMN "baseWeight" DROP NOT NULL`);
    }

}

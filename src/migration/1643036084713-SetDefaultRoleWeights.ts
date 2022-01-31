import {MigrationInterface, QueryRunner} from "typeorm";

export class SetDefaultRoleWeights1643036084713 implements MigrationInterface {
    name = 'SetDefaultRoleWeights1643036084713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role"
            ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name")`);

        await queryRunner.query(`
            insert into role (name)
            values ('Seer')
            on conflict do nothing;
            insert into role (name)
            values ('Lycan')
            on conflict do nothing;
            insert into role (name)
            values ('WildChild')
            on conflict do nothing;
            insert into role (name)
            values ('Gunner')
            on conflict do nothing;
            insert into role (name)
            values ('Oracle')
            on conflict do nothing;
            insert into role (name)
            values ('Arsonist')
            on conflict do nothing;
            insert into role (name)
            values ('ClumsyGuy')
            on conflict do nothing;
            insert into role (name)
            values ('AlphaWolf')
            on conflict do nothing;
            insert into role (name)
            values ('Villager')
            on conflict do nothing;
            insert into role (name)
            values ('Wolf')
            on conflict do nothing;
            insert into role (name)
            values ('Drunk')
            on conflict do nothing;
            insert into role (name)
            values ('Mason')
            on conflict do nothing;
            insert into role (name)
            values ('Cupid')
            on conflict do nothing;
            insert into role (name)
            values ('Undertaker')
            on conflict do nothing;
            insert into role (name)
            values ('Traitor')
            on conflict do nothing;
            insert into role (name)
            values ('Fool')
            on conflict do nothing;
            insert into role (name)
            values ('Pacifist')
            on conflict do nothing;
            insert into role (name)
            values ('Doppelganger')
            on conflict do nothing;
            insert into role (name)
            values ('Blacksmith')
            on conflict do nothing;
            insert into role (name)
            values ('Detective')
            on conflict do nothing;
            insert into role (name)
            values ('SerialKiller')
            on conflict do nothing;
            insert into role (name)
            values ('Thief')
            on conflict do nothing;
            insert into role (name)
            values ('WiseElder') --
            on conflict do nothing;
            insert into role (name)
            values ('Sorcerer')
            on conflict do nothing;
            insert into role (name)
            values ('Monarch')
            on conflict do nothing;
            insert into role (name)
            values ('Mayor')
            on conflict do nothing;
            insert into role (name)
            values ('Beholder')
            on conflict do nothing;
            insert into role (name)
            values ('Princess')
            on conflict do nothing;
            insert into role (name)
            values ('Suicide')
            on conflict do nothing;
            insert into role (name)
            values ('Snowman')
            on conflict do nothing;
            insert into role (name)
            values ('Cursed')
            on conflict do nothing;
            insert into role (name)
            values ('Martyr')
            on conflict do nothing;
            insert into role (name)
            values ('Sandman')
            on conflict do nothing;
            insert into role (name)
            values ('Beauty')
            on conflict do nothing;
            insert into role (name)
            values ('GuardianAngel')
            on conflict do nothing;
            insert into role (name)
            values ('WoodMan')
            on conflict do nothing;
            insert into role (name)
            values ('Prowler')
            on conflict do nothing;
            insert into role (name)
            values ('Cowboy')
            on conflict do nothing;
            insert into role (name)
            values ('Harlot')
            on conflict do nothing;
        `)

        await queryRunner.query(`
            update role
            set "baseWeight"      = 2,
                "conditionWeight" = 4.5
            where name = 'Beholder';

            update role
            set "baseWeight"        = 1,
                "conditionWeight"   = 3,
                "weightCoefficient" = 1
            where name = 'Mason';

            update role
            set "baseWeight" = 7
            where name = 'Gunner';

            update role
            set "baseWeight" = 5.5
            where name = 'WiseElder';

            update role
            set "baseWeight" = -0.5
            where name = 'Beauty';

            update role
            set "baseWeight"       = 3.5,
                "conditionWeight"  = 8,
                "conditionWeight2" = 4.5
            where name = 'Blacksmith';

            update role
            set "baseWeight" = -1
            where name = 'ClumsyGuy';

            update role
            set "baseWeight" = 4.5
            where name = 'Cowboy';

            update role
            set "baseWeight" = 2
            where name = 'Cupid';

            update role
            set "baseWeight"        = 1,
                "conditionWeight"   = 1,
                "weightCoefficient" = 2
            where name = 'Cursed';

            update role
            set "baseWeight" = 8.5
            where name = 'Detective';

            update role
            set "baseWeight"      = 1,
                "conditionWeight" = 3
            where name = 'Drunk';

            update role
            set "baseWeight" = 5
            where name = 'Fool';

            update role
            set "baseWeight" = 7.5
            where name = 'GuardianAngel';

            update role
            set "baseWeight" = 4.5
            where name = 'Harlot';

            update role
            set "baseWeight" = 0
            where name = 'Martyr';

            update role
            set "baseWeight" = 4.5
            where name = 'Mayor';

            update role
            set "baseWeight" = 4.5
            where name = 'Monarch';

            update role
            set "baseWeight" = 5.5
            where name = 'Oracle';

            update role
            set "baseWeight" = 3
            where name = 'Pacifist';

            update role
            set "baseWeight" = 3.5
            where name = 'Princess';

            update role
            set "baseWeight" = 8
            where name = 'Sandman';

            update role
            set "baseWeight" = 6.5
            where name = 'Seer';

            update role
            set "baseWeight" = -5
            where name = 'Traitor';

            update role
            set "baseWeight" = 1
            where name = 'Villager';

            update role
            set "baseWeight" = -1.5
            where name = 'WildChild';

            update role
            set "baseWeight"      = 1,
                "conditionWeight" = -1
            where name = 'WoodMan';

            update role
            set "baseWeight" = -11
            where name = 'AlphaWolf';

            update role
            set "baseWeight"      = -8,
                "conditionWeight" = -10
            where name = 'Lycan';

            update role
            set "baseWeight" = -4
            where name = 'Prowler';

            update role
            set "baseWeight" = -3
            where name = 'Sorcerer';

            update role
            set "baseWeight" = -8
            where name = 'Wolf';

            update role
            set "baseWeight" = -5
            where name = 'Arsonist';

            update role
            set "baseWeight" = -1.5
            where name = 'Doppelganger';

            update role
            set "baseWeight" = -11
            where name = 'SerialKiller';

            update role
            set "baseWeight"        = 1,
                "weightCoefficient" = -0.5
            where name = 'Suicide';

            update role
            set "baseWeight" = -4
            where name = 'Thief';

            update role
            set "baseWeight" = 0.5
            where name = 'Undertaker';

            update role
            set "baseWeight"       = 6.5,
                "conditionWeight"  = 9.5,
                "conditionWeight2" = 8
            where name = 'Snowman';
        `);


        await queryRunner.query(`ALTER TABLE "role"
            ALTER COLUMN "baseWeight" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role"
            ALTER COLUMN "baseWeight" DROP NOT NULL`);


        // delete roles

        await queryRunner.query(`ALTER TABLE "role"
            DROP CONSTRAINT "UQ_ae4578dcaed5adff96595e61660"`);
    }

}

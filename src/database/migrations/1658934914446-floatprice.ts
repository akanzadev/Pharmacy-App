import {MigrationInterface, QueryRunner} from "typeorm";

export class floatprice1658934914446 implements MigrationInterface {
    name = 'floatprice1658934914446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4fbc36ad745962e5c11001e1a8"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "price" double precision NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_4fbc36ad745962e5c11001e1a8" ON "products" ("price", "stock") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4fbc36ad745962e5c11001e1a8"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "price" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_4fbc36ad745962e5c11001e1a8" ON "products" ("price", "stock") `);
    }

}

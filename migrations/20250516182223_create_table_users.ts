import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('user_id');
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('mobile_number').notNullable();
    table.string('alternate_mobile_number').notNullable();
    table.string('email_address').notNullable();
    table.boolean('is_mobile_number_verified').defaultTo(false);
    table.boolean('is_email_verified').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.primary(['user_id']);
    table.unique(['mobile_number']);
    table.unique(['email_address']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}

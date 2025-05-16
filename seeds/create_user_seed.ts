import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      first_name: "Nitesh",
      last_name: "Setti",
      mobile_number: "9032271212",
      alternate_mobile_number: "9567890345",
      email_address: "niteshsetti1528@gmail.com",
      is_mobile_number_verified: true,
      is_email_verified: true,
    },
    {
      first_name: "Ujwala",
      last_name: "Upputuri",
      mobile_number: "9573456789",
      alternate_mobile_number: "9912382142",
      email_address: "ujwalau1528@gmail.com",
      is_mobile_number_verified: true,
      is_email_verified: true,
    },
  ]);
}

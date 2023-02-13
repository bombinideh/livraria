import knex from "knex";

export const database = knex({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "deborah",
    password: "123456789",
    database: "projeto",
  },
});

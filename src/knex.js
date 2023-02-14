import knex from "knex";

export const database = knex({
  client: "pg",
  connection: {
    host: "localhost",
    port: 59001,
    user: "livraria_user",
    password: "123456789",
    database: "livraria",
  },
});

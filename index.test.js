import { parse } from "./index.js";

test("Table Parsing", () => {
  const sqltext = `
  table users {
    id integer
  }

  table roles as R {
    id integer
  }
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ type: "table", name: "users" }),
      expect.objectContaining({ type: "table", name: "roles", alias: "R" }),
    ])
  );
});

test("Table Columns Parsing", () => {
  const sqltext = `
  table users {
    id integer
    name text
    created_at datetime
    height decime(1,2)
  }

  table roles as R {
    id integer
    role varchar
    permissions JSON
  }
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "table",
        name: "users",
        columns: expect.arrayContaining([
          expect.objectContaining({ name: "id", type: "integer" }),
          expect.objectContaining({ name: "name", type: "text" }),
          expect.objectContaining({ name: "created_at", type: "datetime" }),
          expect.objectContaining({ name: "height", type: "decime(1,2)" }),
        ]),
      }),
      expect.objectContaining({
        type: "table",
        name: "roles",
        alias: "R",
        columns: expect.arrayContaining([
          expect.objectContaining({ name: "id", type: "integer" }),
          expect.objectContaining({ name: "role", type: "varchar" }),
          expect.objectContaining({ name: "permissions", type: "JSON" }),
        ]),
      }),
    ])
  );
});

test("Short References Parsing", () => {
  const sqltext = `
  table companies {
    id integer
  }

  table users {
    id integer
    company_id integer
  }

  table user_infos {
    id integer
    user_id integer
  }

  table roles {
    id integer
    user_id integer
  }

  ref: users.id < roles.user_id
  ref: users.company_id > companies.id
  ref: users.id - users_info.user_id
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "table",
        name: "users",
      }),
      expect.objectContaining({
        type: "table",
        name: "roles",
      }),
      expect.objectContaining({
        type: "relationship",
        primary: expect.objectContaining({ table: "users", column: "id" }),
        foreign: expect.objectContaining({ table: "roles", column: "user_id" }),
      }),
      expect.objectContaining({
        type: "relationship",
        primary: expect.objectContaining({ table: "companies", column: "id" }),
        foreign: expect.objectContaining({
          table: "users",
          column: "company_id",
        }),
      }),
      expect.objectContaining({
        type: "relationship",
        primary: expect.objectContaining({ table: "users", column: "id" }),
        isOneToOne: true,
        foreign: expect.objectContaining({
          table: "users_info",
          column: "user_id",
        }),
      }),
    ])
  );
});

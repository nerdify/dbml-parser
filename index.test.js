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

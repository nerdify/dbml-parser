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
    height decimal(1, 2)
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
          expect.objectContaining({ name: "height", type: "decimal(1,2)" }),
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

test("Basic Columns Settings", () => {
  const sqltext = `
  table users {
    id integer [pk]
    name varchar(20) [not null]
    email varchar [not null, unique]
    address text [null]
  }

  table roles {
    id integer [primary key] 
  }

  table products {
    id integer [pk, increment] 
  }
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "table",
        name: "users",
        columns: expect.arrayContaining([
          expect.objectContaining({
            name: "id",
            type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "primary",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "name",
            type: "varchar(20)",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "not null",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "email",
            type: "varchar",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "not null",
              }),
              expect.objectContaining({
                type: "setting",
                value: "unique",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "address",
            type: "text",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "null",
              }),
            ]),
          }),
        ]),
      }),
      expect.objectContaining({
        type: "table",
        name: "roles",
        columns: expect.arrayContaining([
          expect.objectContaining({
            name: "id",
            type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "primary",
              }),
            ]),
          }),
        ]),
      }),
      expect.objectContaining({
        type: "table",
        name: "products",
        columns: expect.arrayContaining([
          expect.objectContaining({
            name: "id",
            type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "primary",
              }),
              expect.objectContaining({
                type: "setting",
                value: "increment",
              }),
            ]),
          }),
        ]),
      }),
    ])
  );
});

test("Note Columns Settings", () => {
  const sqltext = `
  table users {
    id integer [pk, note: 'user id']
    name varchar(20) [not null, note: "user name"]
    email varchar [not null, unique]
  }
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "table",
        name: "users",
        columns: expect.arrayContaining([
          expect.objectContaining({
            name: "id",
            type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "primary",
              }),
              expect.objectContaining({
                type: "note",
                value: "user id",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "name",
            type: "varchar(20)",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "not null",
              }),
              expect.objectContaining({
                type: "note",
                value: "user name",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "email",
            type: "varchar",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "not null",
              }),
              expect.objectContaining({
                type: "setting",
                value: "unique",
              }),
            ]),
          }),
        ]),
      }),
    ])
  );
});

test("Default Columns Settings", () => {
  const sqltext = `
  table users {
    id integer [primary key]
    username varchar(255) [not null, unique, default: 'user_name login']
    full_name varchar(255) [not null]
    gender varchar(1) [default: 'm']
    created_at timestamp [default: \`now()\`]
    rating integer [default: 10]
    average double [default: 1.5]
  }
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "table",
        name: "users",
        columns: expect.arrayContaining([
          expect.objectContaining({
            name: "id",
            type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "primary",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "username",
            type: "varchar(255)",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "not null",
              }),
              expect.objectContaining({
                type: "setting",
                value: "unique",
              }),
              expect.objectContaining({
                type: "default",
                value: "user_name login",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "full_name",
            type: "varchar(255)",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "not null",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "gender",
            type: "varchar(1)",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "default",
                value: "m",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "created_at",
            type: "timestamp",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "default",
                value: "now()",
                expression: true,
              }),
            ]),
          }),
          expect.objectContaining({
            name: "rating",
            type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "default",
                value: 10,
              }),
            ]),
          }),
          expect.objectContaining({
            name: "average",
            type: "double",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "default",
                value: 1.5,
              }),
            ]),
          }),
        ]),
      }),
    ])
  );
});

test("Inline Ref Columns Settings", () => {
  const sqltext = `
  table users {
    id integer [pk, ref: < likes.user_id, ref: < posts.user_id]
    name varchar(20) [not null]
    email varchar [not null, unique]
    address text [null]
    user_info integer [ref: - user_infos.user_id]
  }

  table roles {
    id integer [primary key] 
    user_id integer [ref: > users.id ]
  }
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "table",
        name: "users",
        columns: expect.arrayContaining([
          expect.objectContaining({
            name: "id",
            type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "primary",
              }),
              expect.objectContaining({
                type: "inline_relationship",
                cardinality: "one-to-many",
                table: "likes",
                column: "user_id",
              }),
              expect.objectContaining({
                type: "inline_relationship",
                cardinality: "one-to-many",
                table: "posts",
                column: "user_id",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "name",
            type: "varchar(20)",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "not null",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "email",
            type: "varchar",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "not null",
              }),
              expect.objectContaining({
                type: "setting",
                value: "unique",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "address",
            type: "text",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "null",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "user_info",
            type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "inline_relationship",
                cardinality: "one-to-one",
                table: "user_infos",
                column: "user_id",
              }),
            ]),
          }),
        ]),
      }),
      expect.objectContaining({
        type: "table",
        name: "roles",
        columns: expect.arrayContaining([
          expect.objectContaining({
            name: "id",
            type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "primary",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "user_id",
            type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "inline_relationship",
                cardinality: "many-to-one",
                table: "users",
                column: "id",
              }),
            ]),
          }),
        ]),
      }),
    ])
  );
});

test("Table Index", () => {
  const sqltext = `
  table products {
    id int [pk]
    name varchar
    merchant_id int [not null]
    price int
    status products_status
    created_at datetime [default: \`now()\`]
    update_at datetime [default: \`now()\`]
    arrive_date date

    indexes {  
      id
      \`id*2\`
      (id, country)
      (\`id*2\`)
      (\`id*3\`,\`getdate()\`)
      (\`id*3\`,id)
      id [pk]
      (country, booking_date) [unique]
      created_at [note: 'Date']
      updated_at [note: "Update Date"]
      (merchant_id, status) [unique, note: 'inventory status', name: "inventory status"]
      arrive_date [type: hash, note: "mail arrive"]
      
    }
  }
  `;

  const result = parse(sqltext);

  //Indexes without Settings
  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "table",
        name: "products",
        indexes: expect.arrayContaining([
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "id",
              }),
            ]),
          }),
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "id*2",
                isExpression: true,
              }),
            ]),
          }),
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "id",
              }),
              expect.objectContaining({
                type: "field",
                field: "country",
              }),
            ]),
          }),
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "id*2",
                isExpression: true,
              }),
            ]),
          }),
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "id*3",
                isExpression: true,
              }),
              expect.objectContaining({
                type: "field",
                field: "getdate()",
                isExpression: true,
              }),
            ]),
          }),
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "id*3",
                isExpression: true,
              }),
              expect.objectContaining({
                type: "field",
                field: "id",
              }),
            ]),
          }),
        ]),
      }),
    ])
  );

  //Index Settings
  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "table",
        name: "products",
        indexes: expect.arrayContaining([
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "id",
              }),
            ]),
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "field_setting",
                value: "primary",
              }),
            ]),
          }),
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "country",
              }),
              expect.objectContaining({
                type: "field",
                field: "booking_date",
              }),
            ]),
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "field_setting",
                value: "unique",
              }),
            ]),
          }),
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "created_at",
              }),
            ]),
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "note",
                value: "Date",
              }),
            ]),
          }),
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "updated_at",
              }),
            ]),
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "note",
                value: "Update Date",
              }),
            ]),
          }),
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "updated_at",
              }),
            ]),
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "note",
                value: "Update Date",
              }),
            ]),
          }),
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "status",
              }),
              expect.objectContaining({
                type: "field",
                field: "merchant_id",
              }),
              expect.objectContaining({
                type: "field",
                field: "status",
              }),
            ]),
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "field_setting",
                value: "unique",
              }),
              expect.objectContaining({
                type: "note",
                value: "inventory status",
              }),
              expect.objectContaining({
                type: "index_name",
                value: "inventory status",
              }),
            ]),
          }),
          expect.objectContaining({
            fields: expect.arrayContaining([
              expect.objectContaining({
                type: "field",
                field: "arrive_date",
              }),
            ]),
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "index_type",
                value: "hash",
              }),
            ]),
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "note",
                value: "mail arrive",
              }),
            ]),
          }),
        ]),
      }),
    ])
  );
});

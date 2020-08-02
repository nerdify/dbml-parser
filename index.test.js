import { parse } from "./index.js";

test("Table Parsing", () => {
  const sqltext = `
  table users 

  {
    id integer
  }

  table roles as R {
    id integer
  }

  table categories {
    id integer
  }
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ type: "table", name: "users" }),
      expect.objectContaining({ type: "table", name: "roles", alias: "R" }),
      expect.objectContaining({ type: "table", name: "categories" }),
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

  table roles as R 
  {
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
          expect.objectContaining({ name: "id", variable_type: "integer" }),
          expect.objectContaining({ name: "name", variable_type: "text" }),
          expect.objectContaining({
            name: "created_at",
            variable_type: "datetime",
          }),
          expect.objectContaining({
            name: "height",
            variable_type: "decimal(1,2)",
          }),
        ]),
      }),
      expect.objectContaining({
        type: "table",
        name: "roles",
        alias: "R",
        columns: expect.arrayContaining([
          expect.objectContaining({ name: "id", variable_type: "integer" }),
          expect.objectContaining({ name: "role", variable_type: "varchar" }),
          expect.objectContaining({
            name: "permissions",
            variable_type: "JSON",
          }),
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
            variable_type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "primary",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "name",
            variable_type: "varchar(20)",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "not null",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "email",
            variable_type: "varchar",
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
            variable_type: "text",
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
            variable_type: "integer",
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
            variable_type: "integer",
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
            variable_type: "integer",
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
            variable_type: "varchar(20)",
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
            variable_type: "varchar",
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
            variable_type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "primary",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "username",
            variable_type: "varchar(255)",
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
            variable_type: "varchar(255)",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "not null",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "gender",
            variable_type: "varchar(1)",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "default",
                value: "m",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "created_at",
            variable_type: "timestamp",
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
            variable_type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "default",
                value: 10,
              }),
            ]),
          }),
          expect.objectContaining({
            name: "average",
            variable_type: "double",
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
            variable_type: "integer",
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
            variable_type: "varchar(20)",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "not null",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "email",
            variable_type: "varchar",
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
            variable_type: "text",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "null",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "user_info",
            variable_type: "integer",
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
            variable_type: "integer",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "setting",
                value: "primary",
              }),
            ]),
          }),
          expect.objectContaining({
            name: "user_id",
            variable_type: "integer",
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

test("Table Notes Parsing", () => {
  const sqltext = `
  table users {
    id integer [note: "user id"]
    note: 'this is a note'
  }

  table infos {
    id integer
    note: "this is info"
  }

  table infos_users {
    id integer
    note: '''pivot infos'''
  }

  table likes {
    id integer
    user_id integer
    note { 
      "relation user"
    }
  }


  table roles as R {
    id integer
  }
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "table",
        name: "users",
        note: "this is a note",
        columns: expect.arrayContaining([
          expect.objectContaining({
            type: "column",
            name: "id",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "note",
                value: "user id",
              }),
            ]),
          }),
        ]),
      }),
      expect.objectContaining({
        type: "table",
        name: "infos",
        note: "this is info",
      }),
      expect.objectContaining({
        type: "table",
        name: "infos_users",
        note: "pivot infos",
      }),
      expect.objectContaining({
        type: "table",
        name: "likes",
        note: "relation user",
      }),
      expect.objectContaining({ type: "table", name: "roles", alias: "R" }),
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

    note {
      '''multiline note'''}
  }

  table users
  {
    id primary
    note {"user note"}
    
    indexes  {
      id
    }
  }
  `;

  const result = parse(sqltext);

  //Spaces NL and Index
  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "table",
        name: "users",
        note: "user note",
        indexes: expect.arrayContaining([
          expect.objectContaining({
            fields: expect.arrayContaining([
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
        note: "multiline note",
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

test("Long References Parsing", () => {
  const sqltext = `
  table users {
    id integer
  }

  table users_infos {
    id integer
    user_id integer
  }
  
  table roles {
    id integer
    user_id integer
  }

  ref infos {
    users.id < users_infos.user_id
  }

  ref {
    users.id < roles.user_id
  }
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ type: "table", name: "users" }),
      expect.objectContaining({
        type: "table",
        name: "users_infos",
      }),
      expect.objectContaining({
        type: "relationships",
        name: "infos",
        relationships: expect.arrayContaining([
          expect.objectContaining({
            type: "relationship",
            primary: expect.objectContaining({
              table: "users",
              column: "id",
            }),
            foreign: expect.objectContaining({
              table: "users_infos",
              column: "user_id",
            }),
          }),
        ]),
      }),
      expect.objectContaining({
        type: "relationships",
        relationships: expect.arrayContaining([
          expect.objectContaining({
            type: "relationship",
            primary: expect.objectContaining({
              table: "users",
              column: "id",
            }),
            foreign: expect.objectContaining({
              table: "roles",
              column: "user_id",
            }),
          }),
        ]),
      }),
    ])
  );
});

test("References Setting Parsing", () => {
  const sqltext = `
  table users {
    id integer
  }

  table users_infos {
    id integer
    user_id integer
  }
  
  table roles {
    id integer
    user_id integer
  }

  table stores {
    id integer
    user_id integer
  }

  ref infos 
  {
    users.id < users_infos.user_id [delete: set null, update: set default]
  }

  ref {
    users.id < roles.user_id [delete: cascade]
  }

  ref: users.id < stores.user_id [delete: no action]
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ type: "table", name: "users" }),
      expect.objectContaining({
        type: "table",
        name: "users_infos",
      }),
      expect.objectContaining({
        type: "relationships",
        name: "infos",
        relationships: expect.arrayContaining([
          expect.objectContaining({
            type: "relationship",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "relationship_setting",
                setting: "delete",
                value: "set null",
              }),
              expect.objectContaining({
                type: "relationship_setting",
                setting: "update",
                value: "set default",
              }),
            ]),
            primary: expect.objectContaining({
              table: "users",
              column: "id",
            }),
            foreign: expect.objectContaining({
              table: "users_infos",
              column: "user_id",
            }),
          }),
        ]),
      }),
      expect.objectContaining({
        type: "relationships",
        relationships: expect.arrayContaining([
          expect.objectContaining({
            type: "relationship",
            settings: expect.arrayContaining([
              expect.objectContaining({
                type: "relationship_setting",
                setting: "delete",
                value: "cascade",
              }),
            ]),
            primary: expect.objectContaining({
              table: "users",
              column: "id",
            }),
            foreign: expect.objectContaining({
              table: "roles",
              column: "user_id",
            }),
          }),
        ]),
      }),
      expect.objectContaining({
        type: "relationship",
        primary: expect.objectContaining({
          table: "users",
          column: "id",
        }),
        foreign: expect.objectContaining({
          table: "stores",
          column: "user_id",
        }),
        settings: expect.arrayContaining([
          expect.objectContaining({
            type: "relationship_setting",
            setting: "delete",
            value: "no action",
          }),
        ]),
      }),
    ])
  );
});

test("Enum parsing", () => {
  const sqltext = `
  enum states 
  {
    open
    closed
  }

  enum user_states {
    active
    inactive
    pending [note: 'default state']
  }

  enum item_status { available
    sold
  }

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
      expect.objectContaining({
        type: "enum",
        name: "states",
        values: expect.arrayContaining([
          expect.objectContaining({ value: "open" }),
          expect.objectContaining({ value: "closed" }),
        ]),
      }),
      expect.objectContaining({
        type: "enum",
        name: "user_states",
        values: expect.arrayContaining([
          expect.objectContaining({ value: "active" }),
          expect.objectContaining({ value: "inactive" }),
          expect.objectContaining({ value: "pending", note: "default state" }),
        ]),
      }),
      expect.objectContaining({
        type: "enum",
        name: "item_status",
        values: expect.arrayContaining([
          expect.objectContaining({ value: "available" }),
          expect.objectContaining({ value: "sold" }),
        ]),
      }),
      expect.objectContaining({ type: "table", name: "roles", alias: "R" }),
      expect.objectContaining({ type: "table", name: "users" }),
    ])
  );
});

test("Project Syntax Parsing", () => {
  const sqltext = `
  project main {
    database_type: 'mysql'

    note: "this is a note"

    table users {
      id integer
    }
  
    table roles as R {
      id integer
    }
  }

  table categories {
    id integer
  }

  table infos {
    id integer
  }
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "project",
        name: "main",
        elements: expect.arrayContaining([
          expect.objectContaining({ type: "note", value: "this is a note" }),
          expect.objectContaining({ type: "database", value: "mysql" }),
          expect.objectContaining({ type: "table", name: "users" }),
          expect.objectContaining({ type: "table", name: "roles", alias: "R" }),
        ]),
      }),
      expect.objectContaining({ type: "table", name: "categories" }),
      expect.objectContaining({ type: "table", name: "infos" }),
    ])
  );
});

test("Table Group Parsing", () => {
  const sqltext = `
  table users 
  {
    id integer
  }

  table roles as R {
    id integer
  }

  table categories {
    id integer
  }

  tablegroup main {
    users
    roles
  }
  `;

  const result = parse(sqltext);

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "table_group",
        name: "main",
        tables: expect.arrayContaining(["users", "roles"]),
      }),
      expect.objectContaining({ type: "table", name: "users" }),
      expect.objectContaining({ type: "table", name: "roles", alias: "R" }),
      expect.objectContaining({ type: "table", name: "categories" }),
    ])
  );
});

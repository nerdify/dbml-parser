# dbml-parser

dbml-parser is an attempt to create an agnostic standalone parser compatible with [DBML - Database Markup Language
](https://www.dbml.org/home/).
> This a pretty much a work in progress and not all feature of dbdiagram.io are supported --- yet ;)

After you read the instructutions you can play around with the sintax. [Here](https://sad-bell-d1d31e.netlify.app/)

### Installation

```sh
$ npm install --save nerdify/dsl-dbscheme
```

### Use
Importing
```javascript
import {parse} from 'dsl-dbscheme'
```

Now you can use the parse function to start parsing db schemas.
```javascript
const result = parse(schema);
```

In the previus examplme is `schema` is:

```
Table products {
  id integer [primary key]
  category_id integer
  name varchar
  created_at timestamp
  updated_at timestamp
}
```

`result` will the following array:

```json
[{
	"type": "table",
	"name": "products",
	"columns": [{
		"name": "id",
		"type": "integer",
		"modifiers": ["primary key"]
	}, {
		"name": "category_id",
		"type": "integer",
		"modifiers": []
	}, {
		"name": "name",
		"type": "varchar",
		"modifiers": []
	}, {
		"name": "created_at",
		"type": "timestamp",
		"modifiers": []
	}, {
		"name": "updated_at",
		"type": "timestamp",
		"modifiers": []
	}]
}]
```


### Syntax Examples

**Enums**

schema:

```
enum status {
  pending
  rejected
  approved
}

Table users {
  id integer [primary key]
  email varchar(20) [not null, unique]
  user_status status
}

```

result: 

```json
[{
	"type": "enum",
	"name": "status",
	"items": ["pending", "rejected", "approved"]
}, {
	"type": "table",
	"name": "users",
	"columns": [{
		"name": "id",
		"type": "integer",
		"modifiers": ["primary key"]
	}, {
		"name": "email",
		"type": "varchar(20)",
		"modifiers": ["not null", "unique"]
	}, {
		"name": "user_status",
		"type": "status",
		"modifiers": []
	}]
}]
```

**References**

schema:
```
Table categories {
  id integer [primary key]
  name varchar
}

Table products {
  id integer [primary key]
  category_id integer
  name varchar
}


Ref: products.category_id > categories.id
```

result:
```json
[{
	"type": "table",
	"name": "categories",
	"columns": [{
		"name": "id",
		"type": "integer",
		"modifiers": ["primary key"]
	}, {
		"name": "name",
		"type": "varchar",
		"modifiers": []
	}]
}, {
	"type": "table",
	"name": "products",
	"columns": [{
		"name": "id",
		"type": "integer",
		"modifiers": ["primary key"]
	}, {
		"name": "category_id",
		"type": "integer",
		"modifiers": []
	}, {
		"name": "name",
		"type": "varchar",
		"modifiers": []
	}]
}, {
	"type": "ref",
	"foreign": {
		"table": "products",
		"column": "category_id"
	},
	"primary": {
		"table": "categories",
		"column": "id"
	}
}]
```

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

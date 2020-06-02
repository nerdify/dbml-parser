import { createToken, Lexer, CstParser } from "chevrotain";

const tableDf = createToken({ name: "TableDefinition", pattern: /TABLE/i });
const EnumDf = createToken({ name: "EnumDefinition", pattern: /ENUM/i });
const RefDf = createToken({ name: "RefDefinition", pattern: /REF[ ]*:/i });

const lBraket = createToken({ name: "lBraket", pattern: /[ ]*{[ ]*/ });
const rBraket = createToken({ name: "RBraket", pattern: /[ ]*}[ ]*/ });
const commentLine = createToken({
  name: "commentLine",
  pattern: /[ ]*\/\/.*/,
  group: Lexer.SKIPPED,
});
const comment = createToken({
  name: "Comment",
  pattern: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//,
  group: Lexer.SKIPPED,
});

const lKey = createToken({ name: "lKey", pattern: /\[/ });
const rKey = createToken({ name: "rKey", pattern: /\]/ });
const comma = createToken({ name: "comma", pattern: /,/ });

const doubleQuote = createToken({ name: "doubleQuote", pattern: /"/ });
const singleQuote = createToken({ name: "singleQuote", pattern: /'/ });

const notNull = createToken({ name: "notNull", pattern: /not null/ });
const primaryKey = createToken({ name: "primaryKey", pattern: /primary key/ });
const pk = createToken({ name: "pk", pattern: /pk/ });
const increment = createToken({ name: "increment", pattern: /increment/ });
const unique = createToken({ name: "unique", pattern: /unique/ });

const name = createToken({ name: "name", pattern: /[\w]+(\(\d+\))?/ });
const as = createToken({ name: "as", pattern: / AS[ ]*/i });

const NL = createToken({ name: "NL", pattern: /[\n]+/ });
const GT = createToken({ name: "GT", pattern: />/ });
const DOT = createToken({ name: "DOT", pattern: /\./ });
const WS = createToken({
  name: "WS",
  pattern: /[ |\t]+/,
  group: Lexer.SKIPPED,
});

const allTokens = [
  commentLine,
  comment,
  tableDf,
  RefDf,
  EnumDf,
  lBraket,
  rBraket,
  lKey,
  rKey,
  comma,
  doubleQuote,
  singleQuote,
  notNull,
  primaryKey,
  pk,
  increment,
  unique,
  as,
  name,
  NL,
  WS,
  DOT,
  GT,
];

const lexer = new Lexer(allTokens, {
  positionTracking: "onlyStart",
});

class SchemaParser extends CstParser {
  constructor() {
    super(allTokens);
    const $ = this;

    $.RULE("elements", () => {
      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              $.SUBRULE($.table, { LABEL: "list" });
            },
          },
          {
            ALT: () => {
              $.SUBRULE($.ref, { LABEL: "list" });
            },
          },
          {
            ALT: () => {
              $.SUBRULE($.enum, { LABEL: "list" });
            },
          },
        ]);
      });
    });

    $.RULE("enum", () => {
      $.SUBRULE($.open_enum);
      $.MANY(() => {
        $.SUBRULE($.enum_def, { LABEL: "list" });
      });
      $.SUBRULE($.close_enum);
    });

    $.RULE("open_enum", () => {
      $.CONSUME(EnumDf);
      $.CONSUME(name);
      $.CONSUME(lBraket);
      $.CONSUME(NL);
    });

    $.RULE("close_enum", () => {
      $.CONSUME(rBraket);
      $.CONSUME(NL);
    });

    $.RULE("enum_def", () => {
      $.CONSUME(name);
      $.CONSUME(NL);
    });

    $.RULE("ref", () => {
      $.CONSUME(RefDf);
      $.SUBRULE($.foreign_ref);
      $.CONSUME(GT);
      $.SUBRULE($.primary_ref);
      $.CONSUME(NL);
    });

    $.RULE("foreign_ref", () => {
      $.SUBRULE($.ref_table_col);
    });

    $.RULE("primary_ref", () => {
      $.SUBRULE($.ref_table_col);
    });

    $.RULE("ref_table_col", () => {
      $.SUBRULE($.ref_table);
      $.CONSUME(DOT);
      $.SUBRULE($.ref_column);
    });

    $.RULE("ref_table", () => {
      $.CONSUME(name);
    });

    $.RULE("ref_column", () => {
      $.CONSUME(name);
    });

    $.RULE("table", () => {
      $.SUBRULE($.open_table);
      $.SUBRULE($.columns);
      $.SUBRULE($.close_table);
    });

    $.RULE("open_table", () => {
      $.CONSUME(tableDf);
      $.CONSUME(name);
      $.OPTION(() => {
        $.SUBRULE($.table_alias);
      });
      $.CONSUME(lBraket);
      $.CONSUME(NL);
    });

    $.RULE("close_table", () => {
      $.CONSUME(rBraket);
      $.CONSUME(NL);
    });

    $.RULE("table_alias", () => {
      $.CONSUME(as);
      $.CONSUME(name);
    });

    $.RULE("columns", () => {
      $.MANY(() => {
        $.SUBRULE($.column, { LABEL: "list" });
      });
    });

    $.RULE("column", () => {
      $.SUBRULE($.column_name);
      $.SUBRULE($.type);
      $.OPTION(() => {
        $.SUBRULE($.modifiers);
      });
      $.CONSUME(NL);
    });

    $.RULE("column_name", () => {
      $.OR([
        {
          ALT: () => {
            $.SUBRULE($.single_name);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.quoted_name);
          },
        },
        {
          ALT: () => {
            $.SUBRULE($.single_quoted_name);
          },
        },
      ]);
    });

    $.RULE("single_name", () => {
      $.CONSUME(name);
    });

    $.RULE("quoted_name", () => {
      $.CONSUME(doubleQuote);
      $.MANY(() => {
        $.CONSUME(name);
      });
      $.CONSUME2(doubleQuote);
    });

    $.RULE("single_quoted_name", () => {
      $.CONSUME(singleQuote);
      $.MANY(() => {
        $.CONSUME(name);
      });
      $.CONSUME2(singleQuote);
    });

    $.RULE("type", () => {
      $.CONSUME(name);
    });

    $.RULE("modifiers", () => {
      $.CONSUME(lKey);
      $.MANY_SEP({
        SEP: comma,
        DEF: () => {
          $.SUBRULE($.single_modifier, { LABEL: "list" });
        },
      });
      $.CONSUME(rKey);
    });

    $.RULE("single_modifier", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(notNull);
          },
        },
        {
          ALT: () => {
            $.CONSUME(primaryKey);
          },
        },
        {
          ALT: () => {
            $.CONSUME(pk);
          },
        },
        {
          ALT: () => {
            $.CONSUME(increment);
          },
        },
        {
          ALT: () => {
            $.CONSUME(unique);
          },
        },
      ]);
    });

    this.performSelfAnalysis();
  }
}

const customVisitor = (parser) => {
  const baseSchemeVisitor = parser.getBaseCstVisitorConstructorWithDefaults();

  class CustomVisitorClass extends baseSchemeVisitor {
    constructor() {
      super();
      this.validateVisitor();
    }

    elements(ctx) {
      const result = ctx.list.map((element) => {
        return this.visit(element);
      });

      return result;
    }

    enum(ctx) {
      return {
        type: "enum",
        name: ctx.open_enum[0].children.name[0].image,
        items: ctx.list.map((item) => this.visit(item)),
      };
    }

    enum_def(ctx) {
      return ctx.name[0].image;
    }

    ref(ctx) {
      return {
        type: "ref",
        foreign: {
          ...this.ref_table_col(ctx.foreign_ref[0].children.ref_table_col[0]),
        },
        primary: {
          ...this.ref_table_col(ctx.primary_ref[0].children.ref_table_col[0]),
        },
      };
    }

    ref_table_col(ctx) {
      return {
        table: ctx.children.ref_table[0].children.name[0].image,
        column: ctx.children.ref_column[0].children.name[0].image,
      };
    }

    table(ctx) {
      const alias = ctx.open_table[0].children.table_alias
        ? ctx.open_table[0].children.table_alias[0].children.name[0].image
        : null;
      const tableName = ctx.open_table[0].children.name[0].image;
      const columns = ctx.columns[0].children.list.map((column) =>
        this.visit(column)
      );
      const tableObj = {
        type: "table",
        name: tableName,
        columns: columns,
      };

      if (alias) {
        tableObj.alias = alias;
      }

      return tableObj;
    }

    column(ctx) {
      const name = this.visit(ctx.column_name);
      const type = this.visit(ctx.type);
      const modifiers = this.visit(ctx.modifiers);

      return {
        name: name,
        type: type,
        modifiers: modifiers ? modifiers : [],
      };
    }

    column_name(ctx) {
      if (ctx.single_name) return this.visit(ctx.single_name);
      else if (ctx.quoted_name) return this.visit(ctx.quoted_name);
      else if (ctx.single_quoted_name)
        return this.visit(ctx.single_quoted_name);

      return null;
    }

    single_name(ctx) {
      return ctx.name[0].image;
    }

    quoted_name(ctx) {
      return ctx.name
        .reduce((acc, name) => {
          return acc + " " + name.image;
        }, "")
        .trim();
    }

    single_quoted_name(ctx) {
      return ctx.name
        .reduce((acc, name) => {
          return acc + " " + name.image;
        }, "")
        .trim();
    }

    type(ctx) {
      return ctx.name[0].image;
    }

    modifiers(ctx) {
      return ctx.list.map((modifier) => this.visit(modifier));
    }

    single_modifier(ctx) {
      if (ctx.primaryKey || ctx.pk) {
        return "primary key";
      } else if (ctx.notNull) {
        return "not null";
      } else if (ctx.unique) {
        return "enique";
      } else if (ctx.increment) {
        return "auto increment";
      }

      return null;
    }
  }

  const customVisitorInstance = new CustomVisitorClass();

  return customVisitorInstance;
};

const schemeParser = new SchemaParser();

const parse = (text) => {
  const visitor = customVisitor(schemeParser);

  const lexingResult = lexer.tokenize(text);
  schemeParser.input = lexingResult.tokens;
  console.log(lexingResult.tokens);

  const result = schemeParser.elements();
  console.log(result);
  const parsetOutput = visitor.visit(result);

  if (schemeParser.errors.length > 0) {
    return null;
  }

  return parsetOutput;
};

export { parse };

// Generated automatically by nearley, version 2.19.3
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
  //commentLine: /[ ]*\/\/.*/,
  //comment: /\/\*[^*]*\*+([^/*][^*]*\*+)*\//,

  tableDf: ["table"],
  enumDf:  ["enum"],
  refDf: /ref[ ]*:/,

  lBraket: ["{"],
  rBraket: ["}"],

  lKey: ["["],
  rKey: ["]"],

  comma: [","],

  modifier: ["not null", "primary key", "pk", "increment", "unique"],

  as: ["as"],
  quote: ["\""],
  single_quote: ["'"],
  name: /[\w_\(\)\d]+/,

  NL: { match:/[\n]+/, lineBreaks: true },
  DOT: /\./,
  GT: />/,

  WS: /[ |\t]+/, 

});

lexer.next = (next => () => {
	let tok;
	while (
    (tok = next.call(lexer)) && 
    (
      tok.type === "commentLine" || 
      tok.type === "comment" ||
      tok.type === "WS"
    )
  ) {}
	return tok;
})(lexer.next);

const flatten = d => {
  return d.reduce(
    (a, b) => {
      return a.concat(b);
    },
    []
  );
};
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "elements$ebnf$1", "symbols": []},
    {"name": "elements$ebnf$1$subexpression$1", "symbols": ["table"]},
    {"name": "elements$ebnf$1$subexpression$1", "symbols": ["enum"]},
    {"name": "elements$ebnf$1$subexpression$1", "symbols": ["ref"]},
    {"name": "elements$ebnf$1", "symbols": ["elements$ebnf$1", "elements$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "elements", "symbols": ["elements$ebnf$1"], "postprocess":  (match) => {
          return match[0].map((item) => {return item[0]});
        } },
    {"name": "enum$ebnf$1$subexpression$1", "symbols": ["enum_def"]},
    {"name": "enum$ebnf$1", "symbols": ["enum$ebnf$1$subexpression$1"]},
    {"name": "enum$ebnf$1$subexpression$2", "symbols": ["enum_def"]},
    {"name": "enum$ebnf$1", "symbols": ["enum$ebnf$1", "enum$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "enum", "symbols": ["open_enum", "enum$ebnf$1", "close_enum"], "postprocess":  
        (match) => {
          return {
            type: 'enum',
            name: match[0][1].value,
            list: match[1].map((item) => {return item[0].value})
          }
        }
                },
    {"name": "open_enum", "symbols": [(lexer.has("enumDf") ? {type: "enumDf"} : enumDf), (lexer.has("name") ? {type: "name"} : name), (lexer.has("lBraket") ? {type: "lBraket"} : lBraket), (lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "enum_def", "symbols": [(lexer.has("name") ? {type: "name"} : name), (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": (match) => { return match[0] }},
    {"name": "close_enum", "symbols": [(lexer.has("rBraket") ? {type: "rBraket"} : rBraket), (lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "table$ebnf$1", "symbols": ["column"]},
    {"name": "table$ebnf$1", "symbols": ["table$ebnf$1", "column"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table", "symbols": ["open_table", "table$ebnf$1", "close_table"], "postprocess":  (match) => { 
          const result = {
            type: 'table',
            name: match[0][1].value,
            columns: match[1]
          };
        
          if (match[0][2]) {
            result.alias = match[0][2].value;
          }
          return result;
        }},
    {"name": "open_table$ebnf$1", "symbols": ["table_alias"], "postprocess": id},
    {"name": "open_table$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "open_table", "symbols": [(lexer.has("tableDf") ? {type: "tableDf"} : tableDf), (lexer.has("name") ? {type: "name"} : name), "open_table$ebnf$1", (lexer.has("lBraket") ? {type: "lBraket"} : lBraket), (lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "table_alias", "symbols": [(lexer.has("as") ? {type: "as"} : as), (lexer.has("name") ? {type: "name"} : name)], "postprocess": (match) => { return match[1] }},
    {"name": "close_table", "symbols": [(lexer.has("rBraket") ? {type: "rBraket"} : rBraket), (lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "column$ebnf$1", "symbols": []},
    {"name": "column$ebnf$1", "symbols": ["column$ebnf$1", "modifier_def"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "column", "symbols": ["column_name", (lexer.has("name") ? {type: "name"} : name), "column$ebnf$1", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match) => {
        const result = {
          name: match[0],
          type: match[1].value,
        }
        
        if (match[2][0]) {
          result.modifiers = match[2][0].map((item) => item.value)
        }
        return result;
        } },
    {"name": "column_name", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": (match) => match[0].value},
    {"name": "column_name$ebnf$1", "symbols": [(lexer.has("name") ? {type: "name"} : name)]},
    {"name": "column_name$ebnf$1", "symbols": ["column_name$ebnf$1", (lexer.has("name") ? {type: "name"} : name)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "column_name", "symbols": [(lexer.has("quote") ? {type: "quote"} : quote), "column_name$ebnf$1", (lexer.has("quote") ? {type: "quote"} : quote)], "postprocess":  (match) => {
          return match[1].map((item) => item.value).join(" ");
        } },
    {"name": "column_name$ebnf$2", "symbols": [(lexer.has("name") ? {type: "name"} : name)]},
    {"name": "column_name$ebnf$2", "symbols": ["column_name$ebnf$2", (lexer.has("name") ? {type: "name"} : name)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "column_name", "symbols": [(lexer.has("single_quote") ? {type: "single_quote"} : single_quote), "column_name$ebnf$2", (lexer.has("single_quote") ? {type: "single_quote"} : single_quote)], "postprocess":  (match) => {
          return match[1].map((item) => item.value).join(" ");
        } },
    {"name": "modifier_def", "symbols": [(lexer.has("lKey") ? {type: "lKey"} : lKey), "modifiers", (lexer.has("rKey") ? {type: "rKey"} : rKey)], "postprocess": (match) => { return match[1] }},
    {"name": "modifiers", "symbols": [(lexer.has("modifier") ? {type: "modifier"} : modifier)], "postprocess": (match) => [match[0]]},
    {"name": "modifiers", "symbols": ["modifiers", (lexer.has("comma") ? {type: "comma"} : comma), (lexer.has("modifier") ? {type: "modifier"} : modifier)], "postprocess": (match) => { return flatten([match[0],match[2]]) }},
    {"name": "ref", "symbols": [(lexer.has("refDf") ? {type: "refDf"} : refDf), "column_ref", (lexer.has("GT") ? {type: "GT"} : GT), "column_ref", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": 
        (match) => {
          return {
            type: "ref",
            foreign: match[1],
            primary: match[3]
          }
        }
               },
    {"name": "column_ref", "symbols": [(lexer.has("name") ? {type: "name"} : name), (lexer.has("DOT") ? {type: "DOT"} : DOT), (lexer.has("name") ? {type: "name"} : name)], "postprocess":  (match) => {
          return {
            table: match[0].value,
            column: match[2].value
          }
        }}
]
  , ParserStart: "elements"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

// Generated automatically by nearley, version 2.19.3
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
    tableDf: ["table"],
    enumDf:  ["enum"],
    refDf: /ref[ ]*:/,
    noteDf: /note[ ]*:/,
    defaultDf: /default[ ]*:/,
    number:  /0|[1-9][0-9]*/,

    lBraket: ["{"],
    rBraket: ["}"],

    lKey: ["["],
    rKey: ["]"],

    comma: [","],

    column_setting: ["not null", "null", "primary key", "pk", "increment", "unique"],

    as: ["as"],
    d_quote: /\"[^\"]*\"/,
    s_quote: /\'[^\']*\'/,
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
    {"name": "elements$ebnf$1", "symbols": ["elements$ebnf$1", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "elements$ebnf$2", "symbols": []},
    {"name": "elements$ebnf$2$subexpression$1", "symbols": ["table"]},
    {"name": "elements$ebnf$2$subexpression$1", "symbols": ["enum"]},
    {"name": "elements$ebnf$2$subexpression$1", "symbols": ["ref"]},
    {"name": "elements$ebnf$2", "symbols": ["elements$ebnf$2", "elements$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "elements$ebnf$3", "symbols": []},
    {"name": "elements$ebnf$3", "symbols": ["elements$ebnf$3", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "elements", "symbols": ["elements$ebnf$1", "elements$ebnf$2", "elements$ebnf$3"], "postprocess":  (match) => {
          return match[1].map((item) => {return item[0]});
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
            items: match[1].map((item) => item[0])
          }
        }
                },
    {"name": "open_enum", "symbols": [(lexer.has("enumDf") ? {type: "enumDf"} : enumDf), (lexer.has("name") ? {type: "name"} : name), (lexer.has("lBraket") ? {type: "lBraket"} : lBraket), (lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "enum_def", "symbols": [(lexer.has("name") ? {type: "name"} : name), (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match) => { 
          const item = {value: match[0].value}
          
          if (match[1]) {
            item.note = match[1]
          }
        
          return item;
        } },
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
    {"name": "column$ebnf$1", "symbols": ["column_setting_def"], "postprocess": id},
    {"name": "column$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "column", "symbols": ["column_name", (lexer.has("name") ? {type: "name"} : name), "column$ebnf$1", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match) => {
        let result = {
          name: match[0],
          type: match[1].value,
        }
        
        if (match[2]) {
          result = {
            ... result,
            settings: match[2]
          }
        }
        return result;
        } },
    {"name": "column_name", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": (match) => match[0].value},
    {"name": "column_name", "symbols": ["quote"], "postprocess": id},
    {"name": "column_setting_def", "symbols": [(lexer.has("lKey") ? {type: "lKey"} : lKey), "column_settings", (lexer.has("rKey") ? {type: "rKey"} : rKey)], "postprocess":  
        (match) => { 
            return match[1]
        } },
    {"name": "column_settings$subexpression$1", "symbols": ["column_setting"]},
    {"name": "column_settings$subexpression$1", "symbols": []},
    {"name": "column_settings", "symbols": ["column_settings$subexpression$1"], "postprocess": id},
    {"name": "column_settings", "symbols": ["column_setting", (lexer.has("comma") ? {type: "comma"} : comma), "column_settings"], "postprocess": (match) => { return flatten([match[0],match[2]]) }},
    {"name": "column_setting", "symbols": [(lexer.has("column_setting") ? {type: "column_setting"} : column_setting)], "postprocess": (match) => { return {type: 'setting', value: match[0].value} }},
    {"name": "column_setting", "symbols": ["note"], "postprocess": (match) => { return {type: 'note', value: match[0] } }},
    {"name": "note", "symbols": [(lexer.has("noteDf") ? {type: "noteDf"} : noteDf), "quote"], "postprocess": (match) => match[1]},
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
        }},
    {"name": "default$subexpression$1", "symbols": ["quote"]},
    {"name": "default$subexpression$1", "symbols": ["d_number"]},
    {"name": "default", "symbols": [(lexer.has("lKey") ? {type: "lKey"} : lKey), (lexer.has("defaultDf") ? {type: "defaultDf"} : defaultDf), "default$subexpression$1", (lexer.has("rKey") ? {type: "rKey"} : rKey)], "postprocess": (match) => { return match[2][0] }},
    {"name": "quote", "symbols": [(lexer.has("d_quote") ? {type: "d_quote"} : d_quote)], "postprocess":  (match) => {
          return match[0].value.replace(/\"/g, '')
        } },
    {"name": "quote", "symbols": [(lexer.has("s_quote") ? {type: "s_quote"} : s_quote)], "postprocess":  (match) => {
          return match[0].value.replace(/'/g, '')
        } },
    {"name": "d_number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": (match) => {return parseInt(match[0]) }},
    {"name": "d_number", "symbols": [(lexer.has("number") ? {type: "number"} : number), (lexer.has("DOT") ? {type: "DOT"} : DOT), (lexer.has("number") ? {type: "number"} : number)], "postprocess":  (match) => {
            return parseFloat(`${match[0]}.${match[2]}`)
        } }
]
  , ParserStart: "elements"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

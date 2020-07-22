// Generated automatically by nearley, version 2.19.3
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.states({
    main: {
      tableDf: /table[ ]*/,
      enumDf:  /enum[ ]*/,
      refDf: /ref[ ]*:/,
      refNm: /ref/,
      indexDf: /indexes[ ]*/,
      noteDf: /note[ ]*:/,
      nameDf: /name[ ]*:/,
      typeDf: /type[ ]*:/,
      defaultDf: /default[ ]*:/,
      number:  /0|[1-9][0-9]*/,

      lBraket: /\{/,
      rBraket: /\}/,

      lKey: /\[/,
      rKey: /\]/,

      lP: /\(/,
      rP: /\)/,

      comma: [","],

      updateSettingDf: /update[ ]*:/,
      deleteSettingDf: /delete[ ]*:/,
      relationship_action: ['cascade', 'restrict', 'set null', 'set default', 'no action'],

      column_setting: ["not null", "increment"],

      unique: /unique/,
      primary_key: ["primary key", "pk"],
      null_value: /null/,
      boolean: ["true", "false"],
      noteNm: /note/,

      as: ["as"],
      ml_quote: { match: /'''[^']*'''/, lineBreaks: true },
      d_quote: /\"[^"]*\"/,
      s_quote: /'[^']*'/,
      t_quote: { match:/`[^`]*`/, lineBreaks: true },
      name: /[A-Za-z_0-9]+/,
      

      NL: { match:/[\n]+/, lineBreaks: true },
      DOT: /\./,
      GT: />/,
      LT: /</,
      DASH: /\-/,
      TWODOT: /:/,


      WS: /[ |\t]+/,  
    }
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
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": 
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": 
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": 
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess": 
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "elements$ebnf$1", "symbols": []},
    {"name": "elements$ebnf$1", "symbols": ["elements$ebnf$1", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "elements$ebnf$2", "symbols": []},
    {"name": "elements$ebnf$2$subexpression$1", "symbols": ["table"]},
    {"name": "elements$ebnf$2$subexpression$1", "symbols": ["enum"]},
    {"name": "elements$ebnf$2$subexpression$1", "symbols": ["short_ref"]},
    {"name": "elements$ebnf$2$subexpression$1", "symbols": ["long_ref"]},
    {"name": "elements$ebnf$2", "symbols": ["elements$ebnf$2", "elements$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "elements$ebnf$3", "symbols": []},
    {"name": "elements$ebnf$3", "symbols": ["elements$ebnf$3", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "elements", "symbols": ["elements$ebnf$1", "elements$ebnf$2", "elements$ebnf$3"], "postprocess":  (match) => {
          return match[1].map((item) => {return item[0]});
        } },
    {"name": "long_ref$ebnf$1$subexpression$1", "symbols": [(lexer.has("name") ? {type: "name"} : name)]},
    {"name": "long_ref$ebnf$1", "symbols": ["long_ref$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "long_ref$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "long_ref$ebnf$2", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "long_ref$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "long_ref$ebnf$3", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "long_ref$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "long_ref$ebnf$4$subexpression$1", "symbols": ["long_ref_row"]},
    {"name": "long_ref$ebnf$4", "symbols": ["long_ref$ebnf$4$subexpression$1"]},
    {"name": "long_ref$ebnf$4$subexpression$2", "symbols": ["long_ref_row"]},
    {"name": "long_ref$ebnf$4", "symbols": ["long_ref$ebnf$4", "long_ref$ebnf$4$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "long_ref", "symbols": [(lexer.has("refNm") ? {type: "refNm"} : refNm), "long_ref$ebnf$1", "long_ref$ebnf$2", (lexer.has("lBraket") ? {type: "lBraket"} : lBraket), "long_ref$ebnf$3", "long_ref$ebnf$4", (lexer.has("rBraket") ? {type: "rBraket"} : rBraket), (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match) => {
          const response = {
            type: 'relationships',
            relationships: match[5].map(item => item[0]),
          }
        
          if (match[1]) {
            response.name = match[1][0].value;
          }
        
          return response;
        } },
    {"name": "long_ref_row$ebnf$1$subexpression$1", "symbols": [(lexer.has("lKey") ? {type: "lKey"} : lKey), "relationship_settings", (lexer.has("rKey") ? {type: "rKey"} : rKey)]},
    {"name": "long_ref_row$ebnf$1", "symbols": ["long_ref_row$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "long_ref_row$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "long_ref_row", "symbols": ["ref", "long_ref_row$ebnf$1", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match) => {
          return {
            ...match[0],
            settings: (match[1])? match[1][1]: null
          }
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
            values: match[1].map((item) => item[0])
          }
        }
                },
    {"name": "open_enum$ebnf$1", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "open_enum$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "open_enum$ebnf$2", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "open_enum$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "open_enum", "symbols": [(lexer.has("enumDf") ? {type: "enumDf"} : enumDf), (lexer.has("name") ? {type: "name"} : name), "open_enum$ebnf$1", (lexer.has("lBraket") ? {type: "lBraket"} : lBraket), "open_enum$ebnf$2"]},
    {"name": "enum_def$ebnf$1$subexpression$1", "symbols": [(lexer.has("lKey") ? {type: "lKey"} : lKey), "note", (lexer.has("rKey") ? {type: "rKey"} : rKey)]},
    {"name": "enum_def$ebnf$1", "symbols": ["enum_def$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "enum_def$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "enum_def", "symbols": [(lexer.has("name") ? {type: "name"} : name), "enum_def$ebnf$1", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match) => { 
          const item = {value: match[0].value}
        
          if (match[1] && match[1][1]) {
            item.note = match[1][1].value;
          }
          
          return item;
        } },
    {"name": "close_enum", "symbols": [(lexer.has("rBraket") ? {type: "rBraket"} : rBraket), (lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "table$ebnf$1", "symbols": ["column"]},
    {"name": "table$ebnf$1", "symbols": ["table$ebnf$1", "column"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table$ebnf$2", "symbols": ["table_extra"], "postprocess": id},
    {"name": "table$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table", "symbols": ["open_table", "table$ebnf$1", "table$ebnf$2", "close_table"], "postprocess":  (match) => { 
        
          let result = {
            type: 'table',
            name: match[0][1].value,
            columns: flatten(match[1]).filter((item) => {
              return item.type === 'column'
            }),
          };
        
          if (match[0][2]) {
            result.alias = match[0][2].value;
          }
        
          if (match[2]) {
            result = {
              ...result,
              ...match[2]
            }
          }
        
          return result;
        }},
    {"name": "table_extra$ebnf$1", "symbols": ["table_note"], "postprocess": id},
    {"name": "table_extra$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_extra", "symbols": ["table_index", "table_extra$ebnf$1"], "postprocess":  (match) => {
          const response = {
            indexes: match[0]
          };
        
          if (match[1]) {
            response.note = match[1];
          }
        
          return response;
        } },
    {"name": "table_extra$ebnf$2", "symbols": ["table_index"], "postprocess": id},
    {"name": "table_extra$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_extra", "symbols": ["table_note", "table_extra$ebnf$2"], "postprocess":  match => {
          const response = {
            note: match[0]
          }
          
          if (match[1]) {
            response.indexes = match[1];
          }
        
          return response;
        } },
    {"name": "open_table$ebnf$1", "symbols": ["table_alias"], "postprocess": id},
    {"name": "open_table$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "open_table$ebnf$2", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "open_table$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "open_table$ebnf$3", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "open_table$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "open_table", "symbols": [(lexer.has("tableDf") ? {type: "tableDf"} : tableDf), (lexer.has("name") ? {type: "name"} : name), "open_table$ebnf$1", "open_table$ebnf$2", (lexer.has("lBraket") ? {type: "lBraket"} : lBraket), "open_table$ebnf$3"]},
    {"name": "table_alias", "symbols": [(lexer.has("as") ? {type: "as"} : as), (lexer.has("name") ? {type: "name"} : name)], "postprocess": (match) => { return match[1] }},
    {"name": "close_table", "symbols": [(lexer.has("rBraket") ? {type: "rBraket"} : rBraket), (lexer.has("NL") ? {type: "NL"} : NL)]},
    {"name": "table_index$ebnf$1", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "table_index$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_index$ebnf$2", "symbols": []},
    {"name": "table_index$ebnf$2", "symbols": ["table_index$ebnf$2", "index_row"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_index", "symbols": [(lexer.has("indexDf") ? {type: "indexDf"} : indexDf), "table_index$ebnf$1", (lexer.has("lBraket") ? {type: "lBraket"} : lBraket), (lexer.has("NL") ? {type: "NL"} : NL), "table_index$ebnf$2", (lexer.has("rBraket") ? {type: "rBraket"} : rBraket), (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match) => {
          return match[4];
        } },
    {"name": "index_row", "symbols": ["fields", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": 
        (match) => { 
          const response = {
          type: "index",
          fields: match[0],
        };
        
        return response; 
        }},
    {"name": "index_row", "symbols": ["fields", (lexer.has("lKey") ? {type: "lKey"} : lKey), "field_settings", (lexer.has("rKey") ? {type: "rKey"} : rKey), (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": 
        (match) => { 
            const response = {
            type: "index",
            fields: match[0],
            settings: match[2],
        };
        
        return response; 
        }
                    },
    {"name": "fields", "symbols": ["field_name"], "postprocess":  (match) => {
          return [{
            type: "field",
            ...match[0]
          }]
        } },
    {"name": "fields", "symbols": [(lexer.has("lP") ? {type: "lP"} : lP), "field_names", (lexer.has("rP") ? {type: "rP"} : rP)], "postprocess":  (match) => {
          return match[1].map((item) => {
           return {
             type: "field",
             ...item,
           }
          });
        } },
    {"name": "field_names", "symbols": ["field_name"], "postprocess":  (match) => {
          return [match[0]]
        } },
    {"name": "field_names", "symbols": ["field_names", (lexer.has("comma") ? {type: "comma"} : comma), "field_name"], "postprocess": 
        (match) => {
          return flatten([match[0], match[2]]);
        }
                    },
    {"name": "field_name", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess":  (match) => { 
          return {
            field: match[0].value
          } 
        } },
    {"name": "field_name", "symbols": [(lexer.has("t_quote") ? {type: "t_quote"} : t_quote)], "postprocess":  (match) => {
          return {
            field: match[0].value.replace(/`/g, ''),
            isExpression: true
          }
        }},
    {"name": "field_settings", "symbols": ["field_setting"], "postprocess":  (match) => {
          return [match[0]]
        } },
    {"name": "field_settings", "symbols": ["field_settings", (lexer.has("comma") ? {type: "comma"} : comma), "field_setting"], "postprocess":  (match) => {
          return flatten([match[0], match[2]])
        } },
    {"name": "field_setting", "symbols": [(lexer.has("primary_key") ? {type: "primary_key"} : primary_key)], "postprocess":  (match) => {
            return {
              type: 'field_setting',
              value: 'primary'
            }
        } },
    {"name": "field_setting", "symbols": [(lexer.has("unique") ? {type: "unique"} : unique)], "postprocess":  (match) => {
            return {
              type: 'field_setting',
              value: 'unique'
            }
        } },
    {"name": "field_setting", "symbols": ["note"], "postprocess": (match) => { return match[0] }},
    {"name": "field_setting", "symbols": [(lexer.has("nameDf") ? {type: "nameDf"} : nameDf), "inline_quote"], "postprocess":  (match) => {
            return {
              type: 'index_name',
              value: match[1]
            }
        } },
    {"name": "field_setting", "symbols": [(lexer.has("typeDf") ? {type: "typeDf"} : typeDf), (lexer.has("name") ? {type: "name"} : name)], "postprocess":  (match) => {
            return {
              type: 'index_type',
              value: match[1].value
            }
        } },
    {"name": "column$ebnf$1", "symbols": ["column_setting_def"], "postprocess": id},
    {"name": "column$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "column", "symbols": ["column_name", "column_type", "column$ebnf$1", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match) => {
        let result = {
          type: 'column',
          name: match[0],
          variable_type: match[1],
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
    {"name": "column_name", "symbols": ["inline_quote"], "postprocess": id},
    {"name": "column_setting_def", "symbols": [(lexer.has("lKey") ? {type: "lKey"} : lKey), "column_settings", (lexer.has("rKey") ? {type: "rKey"} : rKey)], "postprocess":  
        (match) => { 
            return match[1]
        } },
    {"name": "column_settings$subexpression$1", "symbols": ["column_setting"]},
    {"name": "column_settings$subexpression$1", "symbols": []},
    {"name": "column_settings", "symbols": ["column_settings$subexpression$1"], "postprocess": id},
    {"name": "column_settings", "symbols": ["column_setting", (lexer.has("comma") ? {type: "comma"} : comma), "column_settings"], "postprocess": (match) => { return flatten([match[0],match[2]]) }},
    {"name": "column_setting", "symbols": [(lexer.has("column_setting") ? {type: "column_setting"} : column_setting)], "postprocess": (match) => { return {type: 'setting', value: match[0].value} }},
    {"name": "column_setting", "symbols": [(lexer.has("primary_key") ? {type: "primary_key"} : primary_key)], "postprocess": (match) => { return {type: 'setting', value: 'primary'} }},
    {"name": "column_setting", "symbols": [(lexer.has("null_value") ? {type: "null_value"} : null_value)], "postprocess": (match) => { return {type: 'setting', value: 'null' } }},
    {"name": "column_setting", "symbols": [(lexer.has("unique") ? {type: "unique"} : unique)], "postprocess": (match) => { return {type: 'setting', value: 'unique' } }},
    {"name": "column_setting", "symbols": ["note"], "postprocess": (match) => { return match[0] }},
    {"name": "column_setting", "symbols": ["default"], "postprocess": (match) => { return {type: 'default', value: match[0]} }},
    {"name": "column_setting", "symbols": ["default_expression"], "postprocess": (match) => { return {type: 'default', expression: true, value: match[0]} }},
    {"name": "column_setting", "symbols": ["default_null"], "postprocess": (match) => { return {type: 'default', value: null} }},
    {"name": "column_setting", "symbols": ["inline_rel"], "postprocess": (match) => { return {...match[0]} }},
    {"name": "inline_rel", "symbols": [(lexer.has("refDf") ? {type: "refDf"} : refDf), (lexer.has("GT") ? {type: "GT"} : GT), "column_ref"], "postprocess":  (match) => {
          return {
            type: 'inline_relationship',
            cardinality: 'many-to-one',
            ...match[2],
          }
        } },
    {"name": "inline_rel", "symbols": [(lexer.has("refDf") ? {type: "refDf"} : refDf), (lexer.has("LT") ? {type: "LT"} : LT), "column_ref"], "postprocess":  (match) => {
          return {
            type: 'inline_relationship',
            cardinality: 'one-to-many',
            ...match[2],
          }
        } },
    {"name": "inline_rel", "symbols": [(lexer.has("refDf") ? {type: "refDf"} : refDf), (lexer.has("DASH") ? {type: "DASH"} : DASH), "column_ref"], "postprocess":  (match) => {
          return {
            type: 'inline_relationship',
            cardinality: 'one-to-one',
            ...match[2],
          }
        } },
    {"name": "short_ref$ebnf$1$subexpression$1", "symbols": [(lexer.has("lKey") ? {type: "lKey"} : lKey), "relationship_settings", (lexer.has("rKey") ? {type: "rKey"} : rKey)]},
    {"name": "short_ref$ebnf$1", "symbols": ["short_ref$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "short_ref$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "short_ref", "symbols": [(lexer.has("refDf") ? {type: "refDf"} : refDf), "ref", "short_ref$ebnf$1", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match) => {
          return {
            ...match[1],
            settings: (match[2])? match[2][1]: null
          }
        } },
    {"name": "relationship_settings$subexpression$1", "symbols": ["relationship_setting"]},
    {"name": "relationship_settings$subexpression$1", "symbols": []},
    {"name": "relationship_settings", "symbols": ["relationship_settings$subexpression$1"], "postprocess": id},
    {"name": "relationship_settings", "symbols": ["relationship_setting", (lexer.has("comma") ? {type: "comma"} : comma), "relationship_settings"], "postprocess": (match) => { return flatten([match[0],match[2]]) }},
    {"name": "relationship_setting", "symbols": [(lexer.has("deleteSettingDf") ? {type: "deleteSettingDf"} : deleteSettingDf), (lexer.has("relationship_action") ? {type: "relationship_action"} : relationship_action)], "postprocess":  (match) => {
          return {
            type: 'relationship_setting',
            setting: 'delete',
            value: match[1].value
          }
        } },
    {"name": "relationship_setting", "symbols": [(lexer.has("updateSettingDf") ? {type: "updateSettingDf"} : updateSettingDf), (lexer.has("relationship_action") ? {type: "relationship_action"} : relationship_action)], "postprocess":  (match) => {
          return {
            type: 'relationship_setting',
            setting: 'update',
            value: match[1].value
          }
        } },
    {"name": "ref", "symbols": ["column_ref", (lexer.has("LT") ? {type: "LT"} : LT), "column_ref"], "postprocess": 
        (match) => {
          return {
            type: 'relationship',
            primary: match[0],
            foreign: match[2],
          }
        }
                      },
    {"name": "ref", "symbols": ["column_ref", (lexer.has("GT") ? {type: "GT"} : GT), "column_ref"], "postprocess": 
        (match) => {
          return {
            type: 'relationship',
            primary: match[2],
            foreign: match[0],
          }
        }
                      },
    {"name": "ref", "symbols": ["column_ref", (lexer.has("DASH") ? {type: "DASH"} : DASH), "column_ref"], "postprocess": 
        (match) => {
          return {
            type: 'relationship',
            isOneToOne: true,
            primary: match[0],
            foreign: match[2],
          }
        }
                      },
    {"name": "column_ref", "symbols": [(lexer.has("name") ? {type: "name"} : name), (lexer.has("DOT") ? {type: "DOT"} : DOT), (lexer.has("name") ? {type: "name"} : name)], "postprocess":  (match) => {
          return {
            table: match[0].value,
            column: match[2].value
          }
        }},
    {"name": "table_note", "symbols": ["note", (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match) => {
          return match[0].value;
        } },
    {"name": "table_note", "symbols": [(lexer.has("noteDf") ? {type: "noteDf"} : noteDf), (lexer.has("ml_quote") ? {type: "ml_quote"} : ml_quote), (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match)  => {
          return match[1].value.replace(/'''/g, '')
        } },
    {"name": "table_note$ebnf$1", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "table_note$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_note$ebnf$2", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "table_note$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_note$subexpression$1", "symbols": [(lexer.has("ml_quote") ? {type: "ml_quote"} : ml_quote)]},
    {"name": "table_note$subexpression$1", "symbols": ["inline_quote"]},
    {"name": "table_note$ebnf$3", "symbols": [(lexer.has("NL") ? {type: "NL"} : NL)], "postprocess": id},
    {"name": "table_note$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_note", "symbols": [(lexer.has("noteNm") ? {type: "noteNm"} : noteNm), "table_note$ebnf$1", (lexer.has("lBraket") ? {type: "lBraket"} : lBraket), "table_note$ebnf$2", "table_note$subexpression$1", "table_note$ebnf$3", (lexer.has("rBraket") ? {type: "rBraket"} : rBraket), (lexer.has("NL") ? {type: "NL"} : NL)], "postprocess":  (match) => {
        
          if (match[4][0].value) {
            return match[4][0].value.replace(/'''/g, '')
          }
        
          return match[4][0];
        } },
    {"name": "note", "symbols": [(lexer.has("noteDf") ? {type: "noteDf"} : noteDf), "inline_quote"], "postprocess":  (match) => { 
          return {
            type: 'note',
            value: match[1]
          }
        } },
    {"name": "default", "symbols": [(lexer.has("defaultDf") ? {type: "defaultDf"} : defaultDf), "inline_quote"], "postprocess": (match) => { return match[1] }},
    {"name": "default", "symbols": [(lexer.has("defaultDf") ? {type: "defaultDf"} : defaultDf), "decimal"], "postprocess": (match) => { return match[1] }},
    {"name": "default", "symbols": [(lexer.has("defaultDf") ? {type: "defaultDf"} : defaultDf), (lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": (match) => { return match[1].value === 'true' }},
    {"name": "default_null", "symbols": [(lexer.has("defaultDf") ? {type: "defaultDf"} : defaultDf), (lexer.has("null_value") ? {type: "null_value"} : null_value)], "postprocess": (match) => { return match[1] }},
    {"name": "default_expression", "symbols": [(lexer.has("defaultDf") ? {type: "defaultDf"} : defaultDf), (lexer.has("t_quote") ? {type: "t_quote"} : t_quote)], "postprocess": (match) => { return match[1].value.replace(/`/g, '') }},
    {"name": "column_type", "symbols": [(lexer.has("name") ? {type: "name"} : name)], "postprocess": (match) => {return match[0].value}},
    {"name": "column_type", "symbols": [(lexer.has("name") ? {type: "name"} : name), (lexer.has("lP") ? {type: "lP"} : lP), "int", (lexer.has("rP") ? {type: "rP"} : rP)], "postprocess": (match) => { return `${match[0]}(${match[2]})` }},
    {"name": "column_type", "symbols": [(lexer.has("name") ? {type: "name"} : name), (lexer.has("lP") ? {type: "lP"} : lP), "int", (lexer.has("comma") ? {type: "comma"} : comma), "int", (lexer.has("rP") ? {type: "rP"} : rP)], "postprocess": (match) => { return `${match[0]}(${match[2]},${match[4]})` }},
    {"name": "inline_quote", "symbols": [(lexer.has("d_quote") ? {type: "d_quote"} : d_quote)], "postprocess":  (match) => {
          return match[0].value.replace(/\"/g, '')
        } },
    {"name": "inline_quote", "symbols": [(lexer.has("s_quote") ? {type: "s_quote"} : s_quote)], "postprocess":  (match) => {
          return match[0].value.replace(/'/g, '')
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

@{%
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
%}

@lexer lexer

elements -> %NL:* (table | enum | ref):* %NL:* {% (match) => {
              return match[1].map((item) => {return item[0]});
            } %}

enum -> open_enum (enum_def):+ close_enum {% 
          (match) => {
            return {
              type: 'enum',
              name: match[0][1].value,
              items: match[1].map((item) => item[0])
            }
          }
        %}

open_enum -> %enumDf %name %lBraket %NL
enum_def -> %name %NL {% (match) => { 
              const item = {value: match[0].value}
              
              if (match[1]) {
                item.note = match[1]
              }

              return item;
            } %}
close_enum -> %rBraket %NL

table -> open_table column:+ close_table {% (match) => { 
            const result = {
              type: 'table',
              name: match[0][1].value,
              columns: match[1]
            };

            if (match[0][2]) {
              result.alias = match[0][2].value;
            }
            return result;
          }%}

open_table -> %tableDf %name table_alias:? %lBraket %NL
table_alias -> %as %name {% (match) => { return match[1] }%}
close_table -> %rBraket %NL

column -> column_name %name column_setting_def:? %NL {% (match) => {
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
          } %}          

column_name -> %name {% (match) => match[0].value %} 
               | quote {% id %}

column_setting_def -> %lKey column_settings %rKey {% 
                (match) => { 
                    return match[1]
                } %}

column_settings -> (column_setting|null) {% id %} |
             column_setting %comma column_settings {% (match) => { return flatten([match[0],match[2]]) } %}


column_setting -> %column_setting {% (match) => { return {type: 'setting', value: match[0].value} }%} |
                  note {% (match) => { return {type: 'note', value: match[0] } }%}

note -> %noteDf quote {% (match) => match[1] %}

ref -> %refDf column_ref %GT column_ref %NL {%
          (match) => {
            return {
              type: "ref",
              foreign: match[1],
              primary: match[3]
            }
          }
       %} 

column_ref -> %name %DOT %name {% (match) => {
              return {
                table: match[0].value,
                column: match[2].value
              }
            }%}

default -> defaultDf (quote|d_number) {% (match) => { return match[2][0] } %}

quote -> %d_quote {% (match) => {
                return match[0].value.replace(/\"/g, '')
              } %}
         | %s_quote {% (match) => {
                return match[0].value.replace(/'/g, '')
              } %}

d_number -> %number {% (match) => {return parseInt(match[0]) } %}
            | %number %DOT %number {% (match) => {
                return parseFloat(`${match[0]}.${match[2]}`)
            } %}
@{%
const moo = require("moo");

const lexer = moo.compile({
  tableDf: ["table"],
  enumDf:  ["enum"],
  refDf: /ref[ ]*:/,
  noteDf: /note[ ]*:/,

  lBraket: ["{"],
  rBraket: ["}"],

  lKey: ["["],
  rKey: ["]"],

  comma: [","],

  modifier: ["not null", "primary key", "pk", "increment", "unique"],

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

elements -> (table | enum | ref):* {% (match) => {
              return match[0].map((item) => {return item[0]});
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
enum_def -> %name note:? %NL {% (match) => { 
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

column -> column_name %name column_extra:? %NL {% (match) => {
          let result = {
            name: match[0],
            type: match[1].value,
          }

          if (match[2]) {
            result = {
              ... result,
              ...match[2]
            }
          }
          return result;
          } %}          

column_name -> %name {% (match) => match[0].value %} 
               | quote {% id %}

column_extra -> modifier_def {% (match) => {
                  return {
                    modifiers: match[0],
                  }
                } %}
                | note {% (match) => {
                  return {
                    note: match[0],
                  }
                } %}
                | modifier_def note {% (match) => {
                  return {
                    modifiers: match[0],
                    note: match[1],
                  }
                } %}
                | note modifier_def {% (match) => {
                  return {
                    note: match[0],
                    modifiers: match[1],
                  }
                } %}

modifier_def -> %lKey modifiers %rKey {% 
                (match) => { 
                    return match[1].map((item) => item.value)
                } %}
modifiers -> %modifier {% (match) => [match[0]]   %} |
             modifiers %comma %modifier {% (match) => { return flatten([match[0],match[2]]) } %}

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

note -> %lKey %noteDf quote %rKey {% (match) => {
          return match[2];
        } %} 

quote -> %d_quote {% (match) => {
                return match[0].value.replace(/\"/g, '')
              } %}
         | %s_quote {% (match) => {
                return match[0].value.replace(/'/g, '')
              } %}
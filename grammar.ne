@builtin "number.ne"
@{%
const moo = require("moo");

const lexer = moo.compile({
    tableDf: /table[ ]*/,
    enumDf:  /enum[ ]*/,
    refDf: /ref[ ]*:/,
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

    column_setting: ["not null", "increment"],
    unique: /unique/,
    primary_key: ["primary key", "pk"],
    null_value: /null/,
    boolean: ["true", "false"],

    as: ["as"],
    d_quote: /\"[^"]*\"/,
    s_quote: /\'[^']*\'/,
    t_quote: /\`[^`]*\`/,
    name: /[A-Za-z_0-9]+/,
    

    NL: { match:/[\n]+/, lineBreaks: true },
    DOT: /\./,
    GT: />/,
    LT: /</,
    DASH: /\-/,


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

table -> open_table column:+ table_index:? close_table {% (match) => { 
            const result = {
              type: 'table',
              name: match[0][1].value,
              columns: match[1]
            };

            if (match[0][2]) {
              result.alias = match[0][2].value;
            }

            if (match[2]) {
              result.indexes = match[2];
            }

            return result;
          }%}

open_table -> %tableDf %name table_alias:? %lBraket %NL
table_alias -> %as %name {% (match) => { return match[1] }%}
close_table -> %rBraket %NL


table_index -> %indexDf %lBraket %NL index_row:* %rBraket %NL {% (match) => {
                return match[3];
              } %}

index_row -> fields %NL {%
                (match) => { 
                  const response = {
                  type: "index",
                  fields: match[0],
                };

                return response; 
                }%}
            | fields %lKey field_settings %rKey %NL {%
              (match) => { 
                  const response = {
                  type: "index",
                  fields: match[0],
                  settings: match[2],
              };

              return response; 
              }
            %}               

fields -> field_name {% (match) => {
                return [{
                  type: "field",
                  ...match[0]
                }]
              } %}
         | %lP field_names %rP {% (match) => {
           return match[1].map((item) => {
            return {
              type: "field",
              ...item,
            }
           });
         } %}

field_names -> field_name {% (match) => {
              return [match[0]]
            } %}
            | field_names %comma field_name {%
              (match) => {
                return flatten([match[0], match[2]]);
              }
            %}

field_name -> %name {% (match) => { 
                return {
                  field: match[0].value
                } 
              } %}
            | %t_quote {% (match) => {
              return {
                field: match[0].value.replace(/`/g, ''),
                isExpression: true
              }
            }%}

field_settings -> field_setting {% (match) => {
                  return [match[0]]
                } %}
              | field_settings %comma field_setting {% (match) => {
                return flatten([match[0], match[2]])
              } %}   

field_setting -> %primary_key {% (match) => {
                  return {
                    type: 'field_setting',
                    value: 'primary'
                  }
              } %}
              | %unique {% (match) => {
                  return {
                    type: 'field_setting',
                    value: 'unique'
                  }
              } %}
              | %noteDf quote {% (match) => {
                  return {
                    type: 'note',
                    value: match[1]
                  }
                } %}
              | %nameDf quote {% (match) => {
                  return {
                    type: 'index_name',
                    value: match[1]
                  }
              } %}   
              | %typeDf %name {% (match) => {
                  return {
                    type: 'index_type',
                    value: match[1].value
                  }
              } %}

column -> column_name column_type column_setting_def:? %NL {% (match) => {
          let result = {
            name: match[0],
            type: match[1],
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

column_setting -> %column_setting {% (match) => { return {type: 'setting', value: match[0].value} }%}
                  | %primary_key {% (match) => { return {type: 'setting', value: 'primary'} }%}
                  | %null_value {% (match) => { return {type: 'setting', value: 'null' } }%}
                  | %unique {% (match) => { return {type: 'setting', value: 'unique' } }%}
                  | note {% (match) => { return {type: 'note', value: match[0]} } %}
                  | default {% (match) => { return {type: 'default', value: match[0]} } %}
                  | default_expression {% (match) => { return {type: 'default', expression: true, value: match[0]} } %}
                  | default_null {% (match) => { return {type: 'default', value: null} } %}
                  | inline_rel {% (match) => { return {...match[0]} } %}

note -> %noteDf quote {% (match) => match[1] %}

inline_rel -> %refDf %GT column_ref {% (match) => {
                          return {
                            type: 'inline_relationship',
                            cardinality: 'many-to-one',
                            ...match[2],
                          }
                        } %}
              | %refDf %LT column_ref {% (match) => {
                          return {
                            type: 'inline_relationship',
                            cardinality: 'one-to-many',
                            ...match[2],
                          }
                        } %}
              | %refDf %DASH column_ref {% (match) => {
                          return {
                            type: 'inline_relationship',
                            cardinality: 'one-to-one',
                            ...match[2],
                          }
                        } %}
                        
ref -> %refDf column_ref %LT column_ref %NL {%
                  (match) => {
                    return {
                      type: 'relationship',
                      primary: match[1],
                      foreign: match[3],
                    }
                  }
              %} 
        | %refDf column_ref %GT column_ref %NL {%
                  (match) => {
                    return {
                      type: 'relationship',
                      primary: match[3],
                      foreign: match[1],
                    }
                  }
              %}
        | %refDf column_ref %DASH column_ref %NL {%
                  (match) => {
                    return {
                      type: 'relationship',
                      isOneToOne: true,
                      primary: match[1],
                      foreign: match[3],
                    }
                  }
              %}  

column_ref -> %name %DOT %name {% (match) => {
              return {
                table: match[0].value,
                column: match[2].value
              }
            }%}

default -> %defaultDf %s_quote {% (match) => { return match[1].value.replace(/'/g, '') } %}
          | %defaultDf decimal {% (match) => { return match[1] } %}
          | %defaultDf %boolean {% (match) => { return match[1].value === 'true' } %}

default_null -> %defaultDf %null_value {% (match) => { return match[1] } %}

default_expression -> %defaultDf %t_quote {% (match) => { return match[1].value.replace(/`/g, '') } %}

#TODO: Check exist a function with more two parameters
column_type -> %name {% (match) => {return match[0].value} %} 
              | %name %lP int %rP {% (match) => { return `${match[0]}(${match[2]})` } %}
              | %name %lP int %comma  int %rP {% (match) => { return `${match[0]}(${match[2]},${match[4]})` } %}

quote -> %d_quote {% (match) => {
                return match[0].value.replace(/\"/g, '')
              } %}
         | %s_quote {% (match) => {
                return match[0].value.replace(/'/g, '')
              } %}
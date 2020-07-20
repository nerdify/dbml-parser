@builtin "number.ne"
@{%
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
%}

@lexer lexer

elements -> %NL:* (table | enum | short_ref | long_ref):* %NL:* {% (match) => {
              return match[1].map((item) => {return item[0]});
            } %}

long_ref -> %refNm (%name):? %lBraket %NL (long_ref_row):+ %rBraket %NL {% (match) => {
              const response = {
                type: 'relationships',
                relationships: match[4].map(item => item[0]),
              }

              if (match[1]) {
                response.name = match[1][0].value;
              }

              return response;
            } %}

long_ref_row -> ref (%lKey relationship_settings %rKey):? %NL {% (match) => {
                return {
                  ...match[0],
                  settings: (match[1])? match[1][1]: null
                }
              } %}

enum -> open_enum (enum_def):+ close_enum {% 
          (match) => {
            return {
              type: 'enum',
              name: match[0][1].value,
              values: match[1].map((item) => item[0])
            }
          }
        %}

open_enum -> %enumDf %name %lBraket %NL
enum_def -> %name (%lKey note %rKey):? %NL {% (match) => { 
              const item = {value: match[0].value}

              if (match[1] && match[1][1]) {
                item.note = match[1][1].value;
              }
              
              return item;
            } %}
close_enum -> %rBraket %NL

table -> open_table (column|table_note):+ table_index:? close_table {% (match) => { 

            const result = {
              type: 'table',
              name: match[0][1].value,
              columns: flatten(match[1]).filter((item) => {
                return item.type === 'column'
              }),
              notes: flatten(match[1]).filter((item) => {
                return item.type === 'note'
              }),
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
              | note {% (match) => { return match[0] } %}
              | %nameDf inline_quote {% (match) => {
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
          } %}          

column_name -> %name {% (match) => match[0].value %} 
               | inline_quote {% id %}

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
                  | note {% (match) => { return match[0] } %}
                  | default {% (match) => { return {type: 'default', value: match[0]} } %}
                  | default_expression {% (match) => { return {type: 'default', expression: true, value: match[0]} } %}
                  | default_null {% (match) => { return {type: 'default', value: null} } %}
                  | inline_rel {% (match) => { return {...match[0]} } %}

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

short_ref -> %refDf ref (%lKey relationship_settings %rKey):? %NL {% (match) => {
                return {
                  ...match[1],
                  settings: (match[2])? match[2][1]: null
                }
              } %}

relationship_settings -> (relationship_setting|null) {% id %}
              | relationship_setting %comma relationship_settings {% (match) => { return flatten([match[0],match[2]]) } %}

relationship_setting -> %deleteSettingDf %relationship_action {% (match) => {
                return {
                  type: 'relationship_setting',
                  setting: 'delete',
                  value: match[1].value
                }
              } %}
              | %updateSettingDf %relationship_action {% (match) => {
                return {
                  type: 'relationship_setting',
                  setting: 'update',
                  value: match[1].value
                }
              } %}                     
                        
ref -> column_ref %LT column_ref {%
                  (match) => {
                    return {
                      type: 'relationship',
                      primary: match[0],
                      foreign: match[2],
                    }
                  }
              %} 
        | column_ref %GT column_ref {%
                  (match) => {
                    return {
                      type: 'relationship',
                      primary: match[2],
                      foreign: match[0],
                    }
                  }
              %}
        | column_ref %DASH column_ref {%
                  (match) => {
                    return {
                      type: 'relationship',
                      isOneToOne: true,
                      primary: match[0],
                      foreign: match[2],
                    }
                  }
              %}

column_ref -> %name %DOT %name {% (match) => {
              return {
                table: match[0].value,
                column: match[2].value
              }
            }%}

table_note -> note %NL {% (match) => {
              return match[0];
            } %}
            | %noteDf %ml_quote %NL {% (match)  => {
              return {
                type: 'note',
                value: match[1].value.replace(/'''/g, '')
              }
            } %}

note -> %noteDf inline_quote {% (match) => { 
          return {
            type: 'note',
            value: match[1]
          }
        } %}

default -> %defaultDf inline_quote {% (match) => { return match[1] } %}
          | %defaultDf decimal {% (match) => { return match[1] } %}
          | %defaultDf %boolean {% (match) => { return match[1].value === 'true' } %}

default_null -> %defaultDf %null_value {% (match) => { return match[1] } %}

default_expression -> %defaultDf %t_quote {% (match) => { return match[1].value.replace(/`/g, '') } %}

#TODO: Check exist a function with more two parameters
column_type -> %name {% (match) => {return match[0].value} %} 
              | %name %lP int %rP {% (match) => { return `${match[0]}(${match[2]})` } %}
              | %name %lP int %comma  int %rP {% (match) => { return `${match[0]}(${match[2]},${match[4]})` } %}

inline_quote -> %d_quote {% (match) => {
                return match[0].value.replace(/\"/g, '')
              } %}
         | %s_quote {% (match) => {
                return match[0].value.replace(/'/g, '')
              } %}
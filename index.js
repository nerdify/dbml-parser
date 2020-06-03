import nearley from "nearley";
import grammar from "./grammar";

const parse = (text) => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

  const response = parser.feed(text);
  return response.results[0];
};

export { parse };

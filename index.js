import nearley from "nearley";
import grammar from "./grammar";

const removeComments = (text) => {
  return text.replace(/\/\/[^\n]*\n/g, "\n");
};

const parse = (text) => {
  try {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    const parsedtext = removeComments(text);
    const response = parser.feed(parsedtext);

    return response.results[0];
  } catch (e) {
    return null;
  }
};

export { parse };

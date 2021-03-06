import nearley from "nearley";
import grammar from "./grammar";

const removeComments = (text) => {
  return text.replace(/\/\/[^\n]*\n/g, "\n");
};

const trimEmptyLines = (text) => {
  return text.split("\n").reduce((acc, curr) => {
    const line = curr.trim();
    return `${acc}\n${line}`;
  }, "");
};

const parse = (text) => {
  try {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    const parsedtext = trimEmptyLines(removeComments(text));
    const response = parser.feed(parsedtext);

    return response.results[0];
  } catch (e) {
    console.log(e);
    return null;
  }
};

export { parse };

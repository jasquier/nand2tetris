import { checkUsage, getLines } from "./cli.js";
import { removeComments } from "./comments.js";
import { removeSymbols } from "./symbols.js";
import { translate } from "./translate.js";

const file = checkUsage(process.argv);
const text = getLines(file);
const program = removeComments(text);
const instructions = removeSymbols(program);
const binary = translate(instructions);
binary.forEach((line) => {
  console.log(line);
});

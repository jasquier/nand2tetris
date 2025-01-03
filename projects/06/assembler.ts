import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

if (process.argv.length !== 3) {
  console.error();
  console.error("Usage: node assembler.js FILE");
  process.exit(1);
}

const path = resolve("./", process.argv[2]);
const text = await readFile(path, "utf-8");
const lines = text.split("\n");
const codeOnly = lines
  // Removes lines that are white-space only
  .filter((line) => /\S/.test(line))
  // Removes lines that start with any white-space and //
  .filter((line) => !/^\s*\/\//.test(line))
  // Remove white-space
  .map((line) => line.trim());

type Symbols =
  | "R0"
  | "R1"
  | "R2"
  | "R3"
  | "R4"
  | "R5"
  | "R6"
  | "R7"
  | "R8"
  | "R9"
  | "R10"
  | "R11"
  | "R12"
  | "R13"
  | "R14"
  | "R15"
  | "SP"
  | "LCL"
  | "ARG"
  | "THIS"
  | "THAT"
  | "SCREEN"
  | "KBD";

const symbolTable: Record<Symbols | string, number> = {
  R0: 0,
  R1: 1,
  R2: 2,
  R3: 3,
  R4: 4,
  R5: 5,
  R6: 6,
  R7: 7,
  R8: 8,
  R9: 9,
  R10: 10,
  R11: 11,
  R12: 12,
  R13: 13,
  R14: 14,
  R15: 15,
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
  SCREEN: 16384,
  KBD: 24576,
};

let nextIndex = 16;

let lineNum = 0;
// Add line numbers to instructions only.
const tuples = codeOnly.map((line) =>
  line[0] === "(" ? ["s", line] : [lineNum++, line],
);

// Next we need to turn (xxx) into xxx: line + 1
const instructionsOnly = tuples.reduce(
  (acc, cur, i, arr) => {
    // Handle symbols.
    if (cur[0] === "s") {
      const newSymbol =
        typeof cur[1] === "string"
          ? cur[1].substring(1, cur[1].length - 1)
          : "";
      if (!symbolTable[newSymbol])
        symbolTable[newSymbol] = arr[i + 1][0] as number;
      return acc;
    }
    // Handle instructions.
    acc.push(cur);
    return acc;
  },
  [] as Array<Array<string | number>>,
);

// Replace variables with numbers, if you encounter one you don't know then mint it.
const noSymbols = instructionsOnly.map((tuple) => {
  const [lineNum, instruction] = tuple;
  if (typeof instruction === "string") {
    if (/^@[a-z]/i.test(instruction)) {
      const symbol = instruction.substring(1);
      if (symbolTable[symbol] === undefined) {
        symbolTable[symbol] = nextIndex++;
      }
      return [lineNum, `@${symbolTable[symbol]}`];
    }
  }
  return tuple;
});

// Now we can map a-instructions to twos complement numbers
// and c-instructions can be parsed to binary

console.log(symbolTable);
console.log(noSymbols);

import { getSymbolTable, SymbolTable } from "./symbolTable.js";

export function removeSymbols(program: readonly string[]): readonly string[] {
  const statements = getStatements(program);
  const symbols = mintSymbols(statements);
  return replaceSymbols(statements, symbols);
}

// Programs contain instructions & instruction labels, both are statements.
type Statement = Readonly<{
  content: string;
  num: number;
  type: "label" | "A-instruction" | "other";
}>;

// String -> Statement. Instruction labels do not advance the counter.
function getStatements(program: readonly string[]): readonly Statement[] {
  let currentInstruction = 0;
  return program.map((line) => {
    const stmt = makeStatement(line, currentInstruction);
    if (stmt.type !== "label") currentInstruction++;
    return stmt;
  });
}

// It is important to mint instruction labels first!
function mintSymbols(statements: readonly Statement[]) {
  const symbols = getSymbolTable();
  mintInstructionLabels(statements, symbols);
  mintAInstructionSymbols(statements, symbols);
  symbols.freeze();
  return symbols;
}

// Removes instruction labels and replaces symbolic A-instructions.
function replaceSymbols(
  statements: readonly Statement[],
  symbols: SymbolTable,
): readonly string[] {
  return statements
    .filter((stmt) => stmt.type !== "label")
    .map((stmt) => {
      if (stmt.type !== "A-instruction") return stmt.content;
      // Extract symbol from content.
      const symbol = getSymbol(stmt.content);
      // Convert symbol to its value.
      // We use ?? because symbol could be a constant the user
      // is trying to load which will not be in the table.
      return makeAInstruction(symbols.get(symbol) ?? symbol);
    });
}

// Determines statement type from content.
function makeStatement(content: string, num: number): Statement {
  const isLabel = content.startsWith("(");
  const isAInstruction = content.startsWith("@");
  const type = isLabel ? "label" : isAInstruction ? "A-instruction" : "other";
  return {
    content,
    num,
    type,
  };
}

// Stores instruction labels with the number they refer to.
function mintInstructionLabels(
  statements: readonly Statement[],
  symbols: SymbolTable,
) {
  statements
    .filter((stmt) => stmt.type === "label")
    .forEach((stmt) => {
      symbols.mintSymbol(getInstructionLabel(stmt.content), stmt.num);
    });
}

// Store all unseen symbols in the symbol table.
// Instruction labels should already be minted.
function mintAInstructionSymbols(
  statements: readonly Statement[],
  symbols: SymbolTable,
) {
  statements
    .filter((stmt) => stmt.type === "A-instruction")
    .map((stmt) => getSymbol(stmt.content))
    .forEach((symbol) => {
      symbols.mintSymbol(symbol);
    });
}

function getSymbol(line: string) {
  return line.split("@")[1];
}

function makeAInstruction(s: string | number | undefined) {
  return `@${s}`;
}

// E.g. "(LOOP)" returns "LOOP".
function getInstructionLabel(content: string) {
  return content.split("(")[1].split(")")[0];
}

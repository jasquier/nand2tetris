export interface SymbolTable {
  get: (key: string) => number | undefined;
  has: (key: string) => boolean;
  mintSymbol: (name: string, value?: number) => boolean;
  freeze: () => void;
  print: () => void;
}

export function getSymbolTable(): SymbolTable {
  const symbolTable: Map<string, number> = new Map();

  symbolTable.set("R0", 0);
  symbolTable.set("R1", 1);
  symbolTable.set("R2", 2);
  symbolTable.set("R3", 3);
  symbolTable.set("R4", 4);
  symbolTable.set("R5", 5);
  symbolTable.set("R6", 6);
  symbolTable.set("R7", 7);
  symbolTable.set("R8", 8);
  symbolTable.set("R9", 9);
  symbolTable.set("R10", 10);
  symbolTable.set("R11", 11);
  symbolTable.set("R12", 12);
  symbolTable.set("R13", 13);
  symbolTable.set("R14", 14);
  symbolTable.set("R15", 15);
  symbolTable.set("SP", 0);
  symbolTable.set("LCL", 1);
  symbolTable.set("ARG", 2);
  symbolTable.set("THIS", 3);
  symbolTable.set("THAT", 4);
  symbolTable.set("SCREEN", 16384);
  symbolTable.set("KBD", 24576);

  let nextIndex = 16;
  let isFrozen = false;

  function mintSymbol(name: string, value?: number) {
    if (isFrozen) throw new Error("Can not mint symbols on a frozen table.");
    const isNumber = !Number.isNaN(Number(name));
    if (isNumber || symbolTable.has(name)) return false;
    symbolTable.set(name, value !== undefined ? value : nextIndex++);
    return true;
  }

  function freeze() {
    isFrozen = true;
  }

  return {
    get: (key: string) => symbolTable.get(key),
    has: (key: string) => symbolTable.has(key),
    mintSymbol,
    freeze,
    print: () => console.log([...symbolTable]),
  };
}

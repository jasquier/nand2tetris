// Hack ASM -> binary. Does no error checking.
export function translate(instructions: readonly string[]) {
  return instructions.map((instruction) => {
    if (instruction.startsWith("@")) {
      return translateAInstruction(instruction);
    } else {
      return translateCInstruction(instruction);
    }
  });
}

function translateAInstruction(instruction: string) {
  const address = instruction.split("@")[1];
  const binaryAddress = toBinary(address, 15);
  return `0${binaryAddress}`;
}

function translateCInstruction(instruction: string) {
  let dest = "none";
  let compJmp = instruction;

  if (instruction.includes("=")) {
    const splits = instruction.split("=");
    dest = splits[0];
    compJmp = splits[1];
  }

  let comp = compJmp;
  let jump = "none";

  if (compJmp.includes(";")) {
    const splits = compJmp.split(";");
    comp = splits[0];
    jump = splits[1];
  }

  const destBinary = toBinary(
    destinations[dest as keyof typeof destinations],
    3,
  );
  const compBinary = toBinary(
    computations[comp as keyof typeof computations],
    7,
  );
  const jumpBinary = toBinary(jumps[jump as keyof typeof jumps], 3);

  return `111${compBinary}${destBinary}${jumpBinary}`;
}

function toBinary(s: string | number, len: number) {
  const n = typeof s === "string" ? Number(s) : s;
  return n.toString(2).padStart(len, "0");
}

const destinations = {
  none: 0,
  M: 1,
  D: 2,
  DM: 3,
  MD: 3,
  A: 4,
  AM: 5,
  MA: 5,
  AD: 6,
  DA: 7,
  ADM: 7,
  AMD: 7,
  MDA: 7,
  MAD: 7,
  DAM: 7,
  DMA: 7,
};

const computations = {
  0: 42,
  1: 63,
  "-1": 58,
  D: 12,
  A: 48,
  "!D": 13,
  "!A": 49,
  "-D": 15,
  "-A": 51,
  "D+1": 31,
  "1+D": 31,
  "A+1": 55,
  "1+A": 35,
  "D-1": 14,
  "A-1": 50,
  "D+A": 2,
  "A+D": 2,
  "D-A": 19,
  "A-D": 7,
  "D&A": 0,
  "A&D": 0,
  "D|A": 21,
  "A|D": 21,
  M: 112,
  "!M": 113,
  "-M": 115,
  "M+1": 119,
  "1+M": 119,
  "M-1": 114,
  "D+M": 66,
  "M+D": 66,
  "D-M": 83,
  "M-D": 71,
  "D&M": 64,
  "M&D": 64,
  "D|M": 85,
  "M|D": 85,
};

const jumps = {
  none: 0,
  JGT: 1,
  JEQ: 2,
  JGE: 3,
  JLT: 4,
  JNE: 5,
  JLE: 6,
  JMP: 7,
};

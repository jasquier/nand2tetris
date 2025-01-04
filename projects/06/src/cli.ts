import { readFileSync } from "node:fs";

// Possibly returns the name of the file to read.
export function checkUsage(argv: readonly string[]) {
  if (argv.length !== 3) {
    console.error();
    console.error("Usage: node main.js <file>");
    process.exit(1);
  }
  return argv[2];
}

export function getLines(file: string): readonly string[] {
  return readFileSync(file, "utf-8").split("\n");
}

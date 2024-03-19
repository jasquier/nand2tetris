// Mult.asm
// Computes: RAM[2] = RAM[0] * RAM[1]

// RAM[2] = 0
  @R2
  M=0

// if RAM[0] == 0 GOTO END
(MULT)
  @R0
  D=M
  @END
  D;JEQ

// RAM[2] += RAM[1]
  @R1
  D=M
  @R2
  M=D+M

// RAM[0] -= 1
  @R0
  M=M-1

// GOTO MULT
  @MULT
  0;JMP

// terminal loop
(END)
  @END
  0;JMP

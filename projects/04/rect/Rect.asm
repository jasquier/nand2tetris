// Rect.asm
// Draws a rectangle in the top left of the screen
// 16 pixels wide and RAM[0] pixels tall

  // RAM[0] = 10
  @10
  D=A
  @R0
  M=D

  // SCP = *SCREEN
  @SCREEN
  D=A
  @SCP
  M=D

  // i = 0
  @0
  D=A
  @i
  M=D

(FILL)
  // Have we drawn RAM[0] lines?
  @i
  D=M
  @R0
  D=D-M
  @END
  D;JEQ

  // Fill the memory with color
  @SCP
  A=M
  M=-1

  // Advance the pointer
  @32
  D=A
  @SCP
  M=M+D

  // i = i + 1
  @i
  M=M+1

  // Loop
  @FILL
  0;JMP

(END)
  @END
  0;JMP

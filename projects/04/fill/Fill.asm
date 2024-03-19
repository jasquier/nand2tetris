// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen
// by writing 'black' in every pixel;
// the screen should remain fully black as long as the key is pressed. 
// When no key is pressed, the program clears the screen by writing
// 'white' in every pixel;
// the screen should remain fully clear as long as no key is pressed.

(LOOP)
  // SCREEN_PTR = *SCREEN
  @SCREEN
  D=A
  @SCREEN_PTR
  M=D
  // SCREEN_END_PTR = *SCREEN + 8192
  @8192
  D=D+A
  @SCREEN_END_PTR
  M=D

  // No key pressed then white
  @KBD
  D=M
  @WHITE
  D;JEQ

  // Else black
  @COLOR
  M=-1

  @DRAW
  0;JMP

(WHITE)
  @COLOR
  M=0

(DRAW)
  // Are we at the end of the screen?
  @SCREEN_PTR
  D=M
  @SCREEN_END_PTR
  D=D-M
  @LOOP
  D;JEQ

  // Fill the memory with color
  @COLOR
  D=M
  @SCREEN_PTR
  A=M
  M=D

  // Advance the pointer
  @SCREEN_PTR
  M=M+1

  // Loop
  @DRAW
  0;JMP

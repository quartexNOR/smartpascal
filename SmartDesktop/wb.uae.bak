unit wb.uae;

interface

uses
  SmartCL.require,
  SmartCL.FileUtils,
  SmartCL.System;


procedure LoadUAECore;



implementation

var
  CNT_AMIGA_FILES: array of string =
  ( "prototypes.js",
    "dms.js",         "config.js",
    "roms.js",        "memory.js",
    "autoconf.js",    "expansion.js",
    "events.js",      "gayle.js",
    "ide.js",         "filesys.js",
    "hardfile.js",    "input.js",
    "serial.js",      "custom.js",
    "blitter.js",     "copper.js",
    "playfield.js",   "video.js",
    "audio.js",       "cia.js",
    "disk.js",        "rtc.js",
    "m68k.js",        "cpu.js",
    "amiga.js"
  );

var
__PRELOAD: integer;
__DONE: integer = 0;

procedure LoadUAECore;
var
  x:  integer;
begin
  __PRELOAD := CNT_AMIGA_FILES.length;
  writeln("Started loading of " + __PRELOAD.toString() + " files");

  for x:=low(CNT_AMIGA_FILES) to high(CNT_AMIGA_FILES)  do
  begin
    var LFileName: string = 'lib/' + CNT_AMIGA_FILES[x];

    TW3Storage.LoadScript(LFileName, procedure (Filename: string)
      begin
        inc(__DONE);

        //delete(Filename,1,4);
        if __DONE >= __PRELOAD then
        begin
          writeln("** UAE CORE LOADED");
        end else
        begin
          writeln("Loaded <" + Filename + "> of " + __PRELOAD.tostring() );
        end;

      end);
  end;
end;

(*
{$R "prototypes.js"}
{$R "amiga.js"}
{$R "audio.js"}
{$R "autoconf.js"}
{$R "blitter.js"}
{$R "cia.js"}
{$R "config.js"}
{$R "copper.js"}
{$R "cpu.js"}
{$R "custom.js"}
{$R "disassembler.js"}
{$R "disk.js"}
{$R "dms.js"}
{$R "events.js"}
{$R "expansion.js"}
{$R "filesys.js"}
{$R "gayle.js"}
{$R "hardfile.js"}
{$R "ide.js"}
{$R "input.js"}
{$R "m68k.js"}
{$R "memory.js"}
{$R "playfield.js"}
{$R "roms.js"}
{$R "rtc.js"}
{$R "serial.js"}
{$R "utils.js"}
{$R "video.js"}      *)

initialization
begin
  // LoadUAECore();
end;

end.
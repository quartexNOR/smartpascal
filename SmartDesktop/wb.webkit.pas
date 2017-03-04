unit wb.webkit;

interface

uses 
  System.Types,
  System.Time, SmartCL.Time,
  SmartCL.System,
  SmartCL.FileUtils;


procedure LoadWebKitEngine;
function  WebKitEngineLoaded: boolean;

implementation

var
__LOADED = false;

function  WebKitEngineLoaded: boolean;
begin
  result := __LOADED;
end;

procedure LoadWebKitEngine;
begin
  TW3Storage.LoadScript('lib/webkit.js', procedure (Filename: string)
  begin
    writeln("** WebKit CORE LOADED");
    __LOADED := true;
  end);
end;

end.

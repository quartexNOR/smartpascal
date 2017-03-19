unit wb.desktop.api;

interface

uses 
  System.Types,
  System.Types.Convert,
  SmartCL.System;


const
  CNT_WB_NameSpace = 'workbench';

  CNT_WB_InitializeWindow = $1010;  /* sent to window after open */
  CNT_WB_FinalizeWindow   = $1011;  /* sent to window before closing */
  CNT_WB_ResizeWindow     = $1012;  /* sent to window after resize */
  CNT_WB_AccessDisabled   = $1013;  /* sent to window when access is disabled */
  CNT_WB_AccessEnabled    = $1014;  /* sent to window when access is enabled */

type

  TWbAPIHandle      = integer;
  TWbAPIError       = integer;

  TWbResult = record
    wbError:  TWbAPIError;
    wbData:   variant;
  end;

  /* This is a callback that external code must implement to catch events.
     After a window has been created, you install a "message-port", which is just
     this callback, allowing the OS to talk with your code */
  TWbAPIMessageHandler = function  (Msg: integer; Data: variant): TWbResult;

  /* Here are the API calls our desktop exposes to external applications */
  TWbAPIOpenWindow          = function (WinWidth, Winheight: integer; const Options: TIntArray): TWbResult;
  TWbAPICloseWindow         = function (Handle: TWbAPIHandle): TWbResult;

  TWbAPIMinimizeWindow      = function (Handle: TWbAPIHandle): TWbResult;
  TWBAPIMaximizeWindow      = function (Handle: TWbAPIHandle): TWbResult;

  TWbAPIGetWindowCaption    = function (Handle: TWbAPIHandle): TWbResult;
  TWbAPISetWindowCaption    = function (Handle: TWbAPIHandle; NewCaption: string): TWbResult;

  TWbAPIGetWindowSize       = function (Handle: TWbAPIHandle): TWbResult;
  TWbAPISetWindowSize       = function (Handle: TWbAPIHandle; NewWidth, NewHeight: integer): TWbResult;

  TWbAPIInstallMsgPort      = function (Handle: TWbAPIHandle; const MsgPort: TWbAPIMessageHandler): TWbResult;

  TWbAPIGetWindowContainer  = function (Handle: TWbAPIHandle): TWbResult;
  TWbAPIDisableWindowAccess = function (Handle: TWbAPIHandle): TWbResult;
  TWbAPIEnableWindowAccess  = function (Handle: TWbAPIHandle): TWbResult;
  TWbAPIQueryWindowAccess   = function (Handle: TWbAPIHandle): TWbResult;

  /* This structure is installed as a global object under the [window]
     namespace in the browser. Access to the API from raw JavaScript thus
     looks like this: window.workbench.wbOpenWindow().
     This makes it very easy to expand and code for the system */

  TWbWorkbenchAPI = record
    wbOpenWindow:           TWbAPIOpenWindow;
    wbCloseWindow:          TWbAPICloseWindow;
    wbMinimizeWindow:       TWbAPIMinimizeWindow;
    wbMaximizeWindow:       TWBAPIMaximizeWindow;
    wbGetWindowCaption:     TWbAPIGetWindowCaption;
    wbSetWindowCaption:     TWbAPISetWindowCaption;
    wbGetWindowSize:        TWbAPIGetWindowSize;
    wbSetWindowSize:        TWbAPISetWindowSize;
    wbInstallMsgPort:       TWbAPIInstallMsgPort;
    wbGetWindowContainer:   TWbAPIGetWindowContainer;
    wbDisableWindowAccess:  TWbAPIDisableWindowAccess;
    wbEnableWindowAccess:   TWbAPIEnableWindowAccess;
    wbQueryWindowAccess:    TWbAPIQueryWindowAccess;
  end;

  TWbPublicAPI = class
  private
    FExposedAPI:  TWbWorkbenchAPI;

  public
    function OpenWindow(WinWidth, Winheight: integer; const Options: TIntArray): TWbResult;
    function CloseWindow(Handle: TWbAPIHandle): TWbResult;

    function MinimizeWindow(Handle: TWbAPIHandle): TWbResult;
    function MaximizeWindow(Handle: TWbAPIHandle): TWbResult;

    function GetWindowCaption(Handle: TWbAPIHandle): TWbResult;
    function SetWindowCaption(Handle: TWbAPIHandle; NewCaption: string): TWbResult;

    function GetWindowSize(Handle: TWbAPIHandle): TWbResult;
    function SetWindowSize(Handle: TWbAPIHandle; NewWidth, NewHeight: integer): TWbResult;

    function InstallMsgPort(Handle: TWbAPIHandle; const MsgPort: TWbAPIMessageHandler): TWbResult;
    function GetWindowContainer(Handle: TWbAPIHandle): TWbResult;
    function DisableWindowAccess(Handle: TWbAPIHandle): TWbResult;
    function EnableWindowAccess(Handle: TWbAPIHandle): TWbResult;
    function QueryWindowAccess(Handle: TWbAPIHandle): TWbResult;

    function  APIInstalled: boolean;
    procedure InstallAPI;
    procedure UninstallAPI;
  end;

  procedure InitializeNativeAPI;
  procedure FinalizeNativeAPI;

  function API_OpenWindow(WinWidth, Winheight: integer; const Options: TIntArray): TWbResult;
  function API_CloseWindow(Handle: TWbAPIHandle): TWbResult;

  function API_MinimizeWindow(Handle: TWbAPIHandle): TWbResult;
  function API_MaximizeWindow(Handle: TWbAPIHandle): TWbResult;

  function API_GetWindowCaption(Handle: TWbAPIHandle): TWbResult;
  function API_SetWindowCaption(Handle: TWbAPIHandle; NewCaption: string): TWbResult;

  function API_GetWindowSize(Handle: TWbAPIHandle): TWbResult;
  function API_SetWindowSize(Handle: TWbAPIHandle; NewWidth, NewHeight: integer): TWbResult;

  function API_InstallMsgPort(Handle: TWbAPIHandle; const MsgPort: TWbAPIMessageHandler): TWbResult;
  function API_GetWindowContainer(Handle: TWbAPIHandle): TWbResult;
  function API_DisableWindowAccess(Handle: TWbAPIHandle): TWbResult;
  function API_EnableWindowAccess(Handle: TWbAPIHandle): TWbResult;
  function API_QueryWindowAccess(Handle: TWbAPIHandle): TWbResult;


implementation

var
  _Obj: TWbPublicAPI;

procedure InitializeNativeAPI;
begin
  _obj := TWbPublicAPI.Create;
  _obj.InstallAPI();
end;

procedure FinalizeNativeAPI;
begin
  if _obj <> nil then
  begin
    _obj.free;
    _obj := nil;
  end;
end;

//#############################################################################
// TWbPublicAPI
//#############################################################################

function TWbPublicAPI.APIInstalled: boolean;
var
  LWindow:  THandle;
begin
  asm
    @LWindow = window;
  end;
  if (LWindow) then
  begin
    if (LWindow[CNT_WB_NameSpace]) then
    begin
      result := LWindow[CNT_WB_NameSpace] <> nil;
    end;
  end;
end;

procedure TWbPublicAPI.InstallAPI;
var
  LWindow:  THandle;
begin
  /* Already installed? Uninstall it */
  if APIInstalled then
    UnInstallAPI();

  /* Get the window object in the browser */
  asm
    @LWindow = window;
  end;

  if (LWindow) then
  begin
    /* Initialize the API structure */
    FExposedAPI.wbOpenWindow          := @API_OpenWindow;
    FExposedAPI.wbCloseWindow         := @API_CloseWindow;
    FExposedAPI.wbMinimizeWindow      := @API_MinimizeWindow;
    FExposedAPI.wbMaximizeWindow      := @API_MaximizeWindow;
    FExposedAPI.wbGetWindowCaption    := @API_GetWindowCaption;
    FExposedAPI.wbSetWindowCaption    := @API_SetWindowCaption;
    FExposedAPI.wbGetWindowSize       := @API_GetWindowSize;
    FExposedAPI.wbSetWindowSize       := @API_SetWindowSize;
    FExposedAPI.wbInstallMsgPort      := @API_InstallMsgPort;
    FExposedAPI.wbGetWindowContainer  := @API_GetWindowContainer;
    FExposedAPI.wbDisableWindowAccess := @API_DisableWindowAccess;
    FExposedAPI.wbEnableWindowAccess  := @API_EnableWindowAccess;
    FExposedAPI.wbQueryWindowAccess   := @API_QueryWindowAccess;

    /* And expose the API */
    LWindow[CNT_WB_NameSpace] := FExposedAPI;
  end else
  raise Exception.Create('Failed to install native API, global window object not found error');
end;

procedure TWbPublicAPI.UninstallAPI;
var
  LWindow:  THandle;
  LName:  string;
begin
  /* Anything to un-install? */
  if APIInstalled then
  begin

    /* Get the window object in the browser */
    asm
      @LWindow = window;
    end;

    /* reset pointer */
    LWindow[CNT_WB_NameSpace] := NIL;

    /* remove property from the window object */
    asm
      delete window[@LName];
    end;
  end;
end;

function TWbPublicAPI.OpenWindow(WinWidth, Winheight: integer; const Options: TIntArray): TWbResult;
begin
  writeln("[DEBUG] OpenWindow");
end;

function TWbPublicAPI.CloseWindow(Handle: TWbAPIHandle): TWbResult;
begin
  writeln("[DEBUG] CloseWindow");
end;

function TWbPublicAPI.MinimizeWindow(Handle: TWbAPIHandle): TWbResult;
begin
  writeln("[DEBUG] MinimizeWindow");
end;

function TWbPublicAPI.MaximizeWindow(Handle: TWbAPIHandle): TWbResult;
begin
  writeln("[DEBUG] MaximizeWindow");
end;

function TWbPublicAPI.GetWindowCaption(Handle: TWbAPIHandle): TWbResult;
begin
  writeln("[DEBUG] GetWindowCaption");
end;

function TWbPublicAPI.SetWindowCaption(Handle: TWbAPIHandle; NewCaption: string): TWbResult;
begin
  writeln("[DEBUG] SetWindowCaption");
end;

function TWbPublicAPI.GetWindowSize(Handle: TWbAPIHandle): TWbResult;
begin
  writeln("[DEBUG] GetWindowSize");
end;

function TWbPublicAPI.SetWindowSize(Handle: TWbAPIHandle; NewWidth, NewHeight: integer): TWbResult;
begin
  writeln("[DEBUG] SetWindowSize");
end;

function TWbPublicAPI.InstallMsgPort(Handle: TWbAPIHandle; const MsgPort: TWbAPIMessageHandler): TWbResult;
begin
  writeln("[DEBUG] InstallMsgPort");
end;

function TWbPublicAPI.GetWindowContainer(Handle: TWbAPIHandle): TWbResult;
begin
  writeln("[DEBUG] GetWindowContainer");
end;

function TWbPublicAPI.DisableWindowAccess(Handle: TWbAPIHandle): TWbResult;
begin
  writeln("[DEBUG] DisableWindowAccess");
end;

function TWbPublicAPI.EnableWindowAccess(Handle: TWbAPIHandle): TWbResult;
begin
  writeln("[DEBUG] EnableWindowAccess");
end;

function TWbPublicAPI.QueryWindowAccess(Handle: TWbAPIHandle): TWbResult;
begin
  writeln("[DEBUG] QueryWindowAccess");
end;

//#############################################################################
// Exposed methods mapped to window.workbench
// These are just proxy methods calling the singleton API object
//#############################################################################


function API_OpenWindow(WinWidth, Winheight: integer; const Options: TIntArray): TWbResult;
begin
  result := _obj.OpenWindow(WinWidth, Winheight,Options);
end;

function API_CloseWindow(Handle: TWbAPIHandle): TWbResult;
begin
  result := _obj.CloseWindow(Handle);
end;

function API_MinimizeWindow(Handle: TWbAPIHandle): TWbResult;
begin
  result := _obj.MinimizeWindow(Handle);
end;

function API_MaximizeWindow(Handle: TWbAPIHandle): TWbResult;
begin
  result := _obj.MaximizeWindow(Handle);
end;

function API_GetWindowCaption(Handle: TWbAPIHandle): TWbResult;
begin
  result := _obj.GetWindowCaption(Handle);
end;

function API_SetWindowCaption(Handle: TWbAPIHandle; NewCaption: string): TWbResult;
begin
  result := _obj.SetWindowCaption(Handle, NewCaption);
end;

function API_GetWindowSize(Handle: TWbAPIHandle): TWbResult;
begin
  result := _obj.GetWindowSize(Handle);
end;

function API_SetWindowSize(Handle: TWbAPIHandle; NewWidth, NewHeight: integer): TWbResult;
begin
  result := _obj.SetWindowSize(Handle, NewWidth, NewHeight);
end;

function API_InstallMsgPort(Handle: TWbAPIHandle; const MsgPort: TWbAPIMessageHandler): TWbResult;
begin
  result := _obj.InstallMsgPort(Handle, MsgPort);
end;

function API_GetWindowContainer(Handle: TWbAPIHandle): TWbResult;
begin
  result := _obj.GetWindowContainer(Handle);
end;

function API_DisableWindowAccess(Handle: TWbAPIHandle): TWbResult;
begin
  result := _obj.DisableWindowAccess(Handle);
end;

function API_EnableWindowAccess(Handle: TWbAPIHandle): TWbResult;
begin
  result := _obj.EnableWindowAccess(Handle);
end;

function API_QueryWindowAccess(Handle: TWbAPIHandle): TWbResult;
begin
  result := _obj.QueryWindowAccess(Handle);
end;

initialization
begin
  InitializeNativeAPI();
end;

finalization
begin
  FinalizeNativeAPI();
end;

end.

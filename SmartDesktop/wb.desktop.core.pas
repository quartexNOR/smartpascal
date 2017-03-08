unit wb.desktop.core;

interface

uses
  W3C.DOM,
  System.Types,
  System.Types.Convert,
  System.Types.Graphics,
  System.Colors,
  System.Time,

  System.Streams,
  System.Reader, System.Stream.Reader,
  System.Writer, System.Stream.Writer,

  System.Structure,
  System.Structure.Json,

  System.Memory,
  System.Memory.Allocation,
  System.Memory.Buffer,

  System.Widget,
  wb.desktop.types,
  wb.desktop.devices,
  wb.desktop.menu,
  wb.desktop.window,
  wb.desktop.iconview,
  wb.desktop.datatypes,
  wb.desktop.preferences,

  SmartCL.MouseTouch,
  SmartCL.Effects,
  SmartCL.System, SmartCL.Graphics, SmartCL.Components,
  SmartCL.Css.Classes,
  SmartCL.Css.StyleSheet,
  SmartCL.Fonts,
  SmartCL.Borders;

type


  TWbDesktopEnumCallback = function (const Item: TWbCustomWindow): TEnumResult;

  TWbDesktop = class(TWbIconView, IWbDesktop, IWbPreferences)
  private
    FFocusedWindow: TWbCustomWindow;
    FWindows: TWbWindowList;
    FPrefs:   TWbPreferences;
    FDatatypes: TWbDatatypeRegistry;

  private
    /* Implements:: IWbPreferences */
    function  GetPreferencesReader: IW3StructureReadAccess;
    function  GetPreferencesWriter: IW3StructureWriteAccess;

  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
  protected
    procedure RegisterWindow(const Window: TWbCustomWindow);
    procedure UnRegisterWindow(const Window: TWbCustomWindow);
    procedure SetFocusedWindow(const Window: TWbCustomWindow);
    function  FindWindowFor(const Control: TWbCustomControl): TWbCustomWindow;
    function  GetActiveWindow: TWbCustomWindow;
    function  GetWindowList: TWbWindowList;

    function  GetPreferences: IWbPreferences;
    function  GetDatatypes: IWbDatatypeRegistry;

    function  KnownWindow(const Window: TWbCustomWindow): boolean;
    function  GetDeviceManager: TWbDeviceManager;
    function  IsDesktop(const Control: TW3CustomControl): boolean;
    procedure SavePreferences;
  public
    property  Preferences: TJSONStructure read FPrefs;
    property  Datatypes: TWbDatatypeRegistry read FDatatypes;

    procedure ForEachWindow(const Process: TWbDesktopEnumCallback);
    procedure ForEachWindowEx(const Before: TProcedureRef;
              const Process: TWbDesktopEnumCallback;
              const After: TProcedureRef);

    procedure LayoutWindows;
  end;



implementation

uses SmartCL.Application, Unit1;

//#############################################################################
// TWbDesktop
//#############################################################################

procedure TWbDesktop.InitializeObject;
begin
  inherited;
  FPrefs := TWbPreferences.Create;
  FDatatypes := TWbDatatypeRegistry.Create;

  /* Register common folder datatype */
  var LFolder := TWbDatatypeIconInfo.Create;
  LFolder.SelectedIcon    := 'res/DefDrawerSel.png';
  LFolder.UnSelectedIcon  := 'res/DefDrawer.png';
  LFolder.Description     := 'Common folder type declaration';
  LFolder.TypeName        := 'folder';
  FDataTypes.Register(LFolder);
end;

procedure TWbDesktop.FinalizeObject;
begin
  FPrefs.free;
  FDatatypes.free;
  inherited;
end;

procedure TWbDesktop.ForEachWindow(const Process: TWbDesktopEnumCallback);
begin
  for var LItem in FWindows do
  begin
    if Process(LItem) = erBreak then
    break;
  end;
end;

procedure TWbDesktop.ForEachWindowEx(const Before: TProcedureRef;
          const Process: TWbDesktopEnumCallback;
          const After: TProcedureRef);
begin
  try
    if assigned(Before) then
    Before();
  finally
    try
      if assigned(Process) then
      begin
        for var LItem in FWindows do
        begin
          if Process(LItem) = erBreak then
          break;
        end;
      end;
    finally
      if assigned(After) then
        After();
    end;
  end;
end;

procedure TWbDesktop.LayoutWindows;
var
  dx, dy: integer;
  wd, hd: integer;
begin
  wd := (clientwidth - 30) div 3;
  hd := clientheight div 2;
  dx := 16;
  dy := 98;
  ForEachWindow( function (const Item: TWbCustomWindow): TEnumResult
  begin
    Item.SetBounds(dx, dy, Item.width, Item.height);
    inc(dx, 32);
    inc(dy, 32);
    result := erContinue;
  end);
end;

/* Datatypes */

function TWbDesktop.GetDatatypes: IWbDatatypeRegistry;
begin
  result := FDatatypes as IWbDatatypeRegistry;
end;

/* Preferences */

function  TWbDesktop.GetPreferences: IWbPreferences;
begin
  result := (self as IWbPreferences);
end;

function  TWbDesktop.GetPreferencesReader: IW3StructureReadAccess;
begin
  result := (FPrefs as IW3StructureReadAccess);
end;

function  TWbDesktop.GetPreferencesWriter: IW3StructureWriteAccess;
begin
  result := (FPrefs as IW3StructureWriteAccess);
end;

/* misc */

function TWbDesktop.IsDesktop(const Control:TW3CustomControl): boolean;
begin
  result := self = Control;
end;

function TWbDesktop.GetDeviceManager: TWbDeviceManager;
begin
  result := TApplication(Application).Devices;
end;

procedure TWbDesktop.SavePreferences;
begin
end;

function TWbDesktop.KnownWindow(const Window: TWbWindow): boolean;
begin
  if Window <> nil then
  begin
    result := FWindows.IndexOf(Window) >= 0;
  end;
end;

procedure TWbDesktop.RegisterWindow(const Window: TWbWindow);
var
  LIndex: integer;
begin
  if Window <> nil then
  begin
    LIndex := FWindows.IndexOf(Window);
    if LIndex <0 then
      FWindows.add(Window);
  end;
end;

procedure TWbDesktop.UnRegisterWindow(const Window: TWbWindow);
var
  LIndex: integer;
begin
  if Window <> nil then
  begin
    LIndex := FWindows.indexOf(Window);
    if LIndex >=0 then
      FWindows.Delete(LIndex, 1);
  end;
end;

procedure TWbDesktop.SetFocusedWindow(const Window: TWbWindow);
begin
  FFocusedWindow := Window;
end;

function TWbDesktop.GetActiveWindow: TWbWindow;
begin
  result := FFocusedWindow;
end;

function TWbDesktop.GetWindowList: TWbWindowList;
begin
  result := FWindows;
end;

function TWbDesktop.FindWindowFor(const Control: TWbCustomControl): TWbWindow;
var
  LNode: TW3TagContainer;
begin
  result := nil;
  if Control <> nil then
  begin
    if (Control is TWbWindow) then
    begin
      // User passed in a window, just return it
      result := TWbWindow(Control);
    end else
    begin
      // backtrack until we find window parent
      LNode := self;
      while (LNode <> nil) do
      begin
        if (LNode is TWbWindow) then
        begin
          result := TWbWindow(LNode);
          break;
        end;
        LNode := LNode.Parent;
      end;
    end;
  end;
end;


end.

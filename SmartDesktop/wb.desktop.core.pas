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

  SmartCL.MouseTouch,
  SmartCL.Effects,
  SmartCL.System, SmartCL.Graphics, SmartCL.Components,
  SmartCL.Css.Classes,
  SmartCL.Css.StyleSheet,
  SmartCL.Fonts,
  SmartCL.Borders;

type

  TWbDesktop = class(TWbIconView, IWbDesktop)
  private
    FFocusedWindow: TWbCustomWindow;
    FWindows: TWbWindowList;
    FPrefs:   TJSONStructure;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
  public
    procedure RegisterWindow(const Window: TWbCustomWindow);
    procedure UnRegisterWindow(const Window: TWbCustomWindow);
    procedure SetFocusedWindow(const Window: TWbCustomWindow);
    function  FindWindowFor(const Control: TWbCustomControl): TWbCustomWindow;
    function  GetActiveWindow: TWbCustomWindow;
    function  GetWindowList: TWbWindowList;
    function  GetPreferencesObject: TW3Structure;
    function  KnownWindow(const Window: TWbCustomWindow): boolean;
    function  GetDeviceManager: TWbDeviceManager;
    function  IsDesktop(const Control: TW3CustomControl): boolean;

    procedure SavePreferences;
  end;



implementation

uses SmartCL.Application, Unit1;

procedure TWbDesktop.InitializeObject;
begin
  inherited;
  FPrefs := TJSONStructure.Create;
  FPrefs.WriteBool(PREFS_WINDOW_EFFECTS_OPEN, true);
  FPrefs.WriteBool(PREFS_WINDOW_EFFECTS_CLOSE, true);
  FPrefs.WriteBool(PREFS_WINDOW_EFFECTS_MIN, false);
  FPrefs.WriteBool(PREFS_WINDOW_EFFECTS_MAX, false);
end;

procedure TWbDesktop.FinalizeObject;
begin
  FPrefs.free;
  inherited;
end;

procedure TWbDesktop.ObjectReady;
begin
  inherited;
end;

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

function TWbDesktop.GetPreferencesObject: TW3Structure;
begin
  result := FPrefs;
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

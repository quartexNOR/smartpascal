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
  wb.desktop.classes,
  wb.desktop.preferences,

  SmartCL.Controls.Button,
  SmartCL.MouseTouch,
  SmartCL.Effects,
  SmartCL.System, SmartCL.Graphics, SmartCL.Components,
  SmartCL.Css.Classes,
  SmartCL.Css.StyleSheet,
  SmartCL.Fonts,
  SmartCL.Borders;

type


  TWbIconDoc = class(TWbCustomControl)
  end;

  TWbDesktopView = class(TWbIconView)
  private
    FDoc:     TWbIconDoc;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure Resize; override;
  end;

  TWbDesktopViewEnumCallback = function (const Item: TWbCustomWindow): TEnumResult;

  TWbDesktopScreen = class(TW3CustomControl, IWbDesktop, IWbPreferences)
  private
    FHeader:    TWbWorkbenchMenuBar;
    FView:      TWbDesktopView;
    FFocusedWindow: TWbCustomWindow;
    FWindows:   TWbWindowList;
    FPrefs:     TWbPreferences;
    FDatatypes: TWbDatatypeRegistry;
    FActions:   TWbClassActions;
    FDevices:   TWbDeviceManager;
    FCausedMenuToShow: boolean;
  private
    /* Implements:: IWbPreferences */
    function  GetPreferencesReader: IW3StructureReadAccess;
    function  GetPreferencesWriter: IW3StructureWriteAccess;

    /* Implements:: IWbDesktop */
    procedure RegisterWindow(const Window: TWbCustomWindow);
    procedure UnRegisterWindow(const Window: TWbCustomWindow);
    procedure SetFocusedWindow(const Window: TWbCustomWindow);
    function  FindWindowFor(const Control: TWbCustomControl): TWbCustomWindow;
    function  GetActiveWindow: TWbCustomWindow;
    function  GetWindowList: TWbWindowList;

    procedure ExecuteFile(Device: TWbStorageDevice; FullPath: string);

    function  GetPreferences: IWbPreferences;
    function  GetDatatypes: IWbDatatypeRegistry;

    function  KnownWindow(const Window: TWbCustomWindow): boolean;
    function  GetDeviceManager: TWbDeviceManager;
    function  IsDesktop(const Control: TW3CustomControl): boolean;
    procedure SavePreferences;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure Resize; override;
  public
    property  Menu: TWbWorkbenchMenuBar read FHeader;
    property  View: TWbDesktopView read FView;
    property  Devices: TWbDeviceManager read FDevices;
    property  Actions: TWbClassActions read FActions;
    property  Preferences: TJSONStructure read FPrefs;
    property  Datatypes: TWbDatatypeRegistry read FDatatypes;

    procedure ForEachWindow(const Process: TWbDesktopViewEnumCallback);
    procedure ForEachWindowEx(const Before: TProcedureRef;
              const Process: TWbDesktopViewEnumCallback;
              const After: TProcedureRef);

    procedure LayoutWindows;
  end;


implementation

uses SmartCL.Application, Unit1;

//#############################################################################
// TWbDesktopScreen
//#############################################################################

procedure TWbDesktopScreen.InitializeObject;
begin
  inherited;

  self.OnMouseDown := procedure (Sender: TObject; Button: TMouseButton;
    Shift: TShiftState; X, Y: integer)
  begin
    if Button = TMouseButton.mbRight then
    begin
      if not FHeader.Active then
      begin
        FCausedMenuToShow := true;
        FHeader.SetCapture();
        FHeader.ShowMenus();
      end;
    end;
  end;

  self.OnMouseUp :=  procedure (Sender: TObject; Button: TMouseButton;
    Shift: TShiftState; X, Y: integer)
  begin
    if Button = TMouseButton.mbRight then
    begin
      if FHeader.Active then
      begin
        if FCausedMenuToShow then
        begin
          FCausedMenuToShow := false;
          FHeader.ReleaseCapture();
          FHeader.HideMenus();
        end;
      end;
    end;
  end;

  FView := TWbDesktopView.Create(self);
  FHeader := TWbWorkbenchMenuBar.Create(self);
  FHeader.Handle.style['box-shadow'] := "10px 10px 23px -4px rgba(0,0,0,0.69)";

  FDevices := TWbDeviceManager.Create;
  FDevices.RegisterDevice(TWbStorageDeviceRamDisk, false);
  FDevices.RegisterDevice(TWbStorageDeviceCache, true);

  FPrefs := TWbPreferences.Create;
  FDatatypes := TWbDatatypeRegistry.Create;
  FActions := TWbClassActions.Create;

  /* Register common folder datatype */
  var LFolder := TWbDatatypeIconInfo.Create;
  LFolder.Identifier      := CNT_ID_DATATYPE_FOLDER;
  LFolder.SelectedIcon    := 'res/DefDrawerSel.png';
  LFolder.UnSelectedIcon  := 'res/DefDrawer.png';
  LFolder.Description     := 'Common folder type declaration';
  LFolder.TypeName        := 'folder';
  FDataTypes.Register(LFolder);

  /* Register common textfile datatype */
  var LText := TWbDatatypeFile.Create;
  LText.Identifier := CNT_ID_DATATYPE_TEXT;
  LText.SelectedIcon := '';
  Ltext.UnSelectedIcon := '';
  LText.Description :='Common textfile format';
  LText.TypeName := 'textfile';
  LText.FileExt := '.txt';
  FDataTypes.Register(LText);

  /* Connect textfile with open class-action */
  FActions.AddRunWith(LText.Identifier,'$internal:aminote');

end;

procedure TWbDesktopScreen.FinalizeObject;
begin
  FHeader.free;
  FView.free;
  FPrefs.free;
  FDatatypes.free;
  FActions.free;
  FDevices.free;
  inherited;
end;

procedure TWbDesktopScreen.Resize;
begin
  inherited;
  FHeader.SetBounds(0,0, ClientWidth, FHeader.height);
  FView.SetBounds(0, FHeader.height, ClientWidth, ClientHeight - FHeader.Height);
end;


procedure TWbDesktopScreen.ForEachWindow(const Process: TWbDesktopViewEnumCallback);
begin
  for var LItem in FWindows do
  begin
    if Process(LItem) = erBreak then
    break;
  end;
end;

procedure TWbDesktopScreen.ForEachWindowEx(const Before: TProcedureRef;
          const Process: TWbDesktopViewEnumCallback;
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

procedure TWbDesktopScreen.LayoutWindows;
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

procedure TWbDesktopScreen.ExecuteFile(Device: TWbStorageDevice; FullPath: string);
begin
  showmessage('Execution of [' + Fullpath + '] dispatched');
end;

/* Datatypes */

function TWbDesktopScreen.GetDatatypes: IWbDatatypeRegistry;
begin
  result := FDatatypes as IWbDatatypeRegistry;
end;

/* Preferences */

function  TWbDesktopScreen.GetPreferences: IWbPreferences;
begin
  result := (self as IWbPreferences);
end;

function  TWbDesktopScreen.GetPreferencesReader: IW3StructureReadAccess;
begin
  result := (FPrefs as IW3StructureReadAccess);
end;

function  TWbDesktopScreen.GetPreferencesWriter: IW3StructureWriteAccess;
begin
  result := (FPrefs as IW3StructureWriteAccess);
end;

/* misc */

function TWbDesktopScreen.IsDesktop(const Control:TW3CustomControl): boolean;
begin
  result := self = Control;
end;

function TWbDesktopScreen.GetDeviceManager: TWbDeviceManager;
begin
  result := FDevices;
end;

procedure TWbDesktopScreen.SavePreferences;
const
  CNT_PREFSPATH = '~/Prefs/preferences.set';
var
  LDevice: TWbStorageDevice;
  LFileSys: IWbFileSystem;
  LData:    TStream;
begin
  LDevice := FDevices.GetBootDevice();
  if LDevice <> nil then
  begin
    LFileSys := LDevice as IWbFileSystem;
    LData :=FPrefs.ToStream();
    try
      writeln("Issuing save for preferences data");
      LFileSys.Save(CNT_PREFSPATH, LData,
        procedure (const Path: string; const Value: variant)
        begin
          if not Value = true then
          showmessage("There was a problem saving data to " + Path );
        end);
    finally
      LData.free;
    end;
  end else
  writeln("Could not find boot device");
end;

function TWbDesktopScreen.KnownWindow(const Window: TWbWindow): boolean;
begin
  if Window <> nil then
  begin
    result := FWindows.IndexOf(Window) >= 0;
  end;
end;

procedure TWbDesktopScreen.RegisterWindow(const Window: TWbWindow);
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

procedure TWbDesktopScreen.UnRegisterWindow(const Window: TWbWindow);
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

procedure TWbDesktopScreen.SetFocusedWindow(const Window: TWbWindow);
begin
  FFocusedWindow := Window;
end;

function TWbDesktopScreen.GetActiveWindow: TWbWindow;
begin
  result := FFocusedWindow;
end;

function TWbDesktopScreen.GetWindowList: TWbWindowList;
begin
  result := FWindows;
end;

function TWbDesktopScreen.FindWindowFor(const Control: TWbCustomControl): TWbWindow;
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

//#############################################################################
// TWbDesktopView
//#############################################################################

procedure TWbDesktopView.InitializeObject;
begin
  inherited;
  FDoc := TWbIconDoc.Create(self);
  FDoc.Border.Size := 2;
  FDoc.Border.Color := clBlack;
  FDoc.Border.Style := besSolid;
  FDoc.BorderRadius := 6;
  FDoc.Background.FromColor(clWhite);
end;

procedure TWbDesktopView.FinalizeObject;
begin
  FDoc.free;
  inherited;
end;

procedure TWbDesktopView.Resize;
var
  dx, dy, wd, hd: integer;
begin
  inherited;
  wd := 64 + 8;
  dx := Clientwidth - (wd + 8);
  hd := 70 * ClientHeight div 100;
  dy := ((clientheight - 16) div 2) - (hd div 2);
  //hd := ClientHeight - (dy * 2);
  FDoc.SetBounds(dx, dy, wd, hd);
end;

end.

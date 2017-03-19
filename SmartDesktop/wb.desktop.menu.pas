unit wb.desktop.menu;

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

  SmartCL.System, SmartCL.Graphics, SmartCL.Components,
  SmartCL.MouseTouch, SmartCL.Effects,
  SmartCL.Css.Classes, SmartCL.Css.StyleSheet,
  SmartCL.Fonts, SmartCL.Borders,
  SmartCL.Controls.Image, SmartCL.Controls.Label
  ;


type

  TWbMenuNodeCallback = procedure (Sender: TObject; MenuId: integer);

  TWbMenuNode = class
  private
    FChildren:  Array of TWbMenuNode;
    function  GetItem(const index: integer): TWbMenuNode;
    function  GetCount: integer;
  public
    property    Id: integer;
    property    Title: string;
    property    Callback: TWbMenuNodeCallback;
    property    Enabled: boolean;
    property    SubItems[const index: integer]: TWbMenuNode read GetItem; default;
    property    Count: integer read GetCount;

    procedure   Clear;

    destructor  Destroy; override;
  end;

  TWbMenuItem = class(TW3CustomControl)
  private
    FCaption: TW3Label;
    FGlyph:   TW3Image;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  public
    property  Caption: TW3Label read FCaption;
    property  Glyph: TW3Image read FGlyph;
  end;

  TWbMenu = class(TW3CustomControl)
  protected
    procedure Resize; override;
  public
    function  Add(Caption: string): TWbMenuItem;
  end;


  TWbWorkbenchMenuBar = class(TW3CustomControl)
  private
    FCaption: TW3Label;
    FGlyph:   TW3Image;
    FActive:  boolean;

    FWbItem:      TWbMenuItem;
    FWindowItem:  TWbMenuItem;
    FIconsItem:   TWbMenuItem;
    FToolsItem:   TWbMenuItem;

    procedure SetVisibleItems(const Value: boolean);

  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure Resize; override;
    procedure ObjectReady; override;
    procedure StyleTagObject; override;
  public
    property  Glyph: TW3Image read FGlyph;
    property  Title: TW3Label read FCaption;
    property  Active: boolean read FActive;

    function  ShowMenus: boolean;
    function  HideMenus: boolean;

    function  Toggle: boolean;
  end;

implementation

//#############################################################################
// TWbMenuNode
//#############################################################################

destructor  TWbMenuNode.Destroy;
begin
  inherited;
end;

procedure TWbMenuNode.Clear;
begin
end;

function TWbMenuNode.GetItem(const index: Integer): TWbMenuNode;
begin

end;

function TWbMenuNode.GetCount: Integer;
begin

end;

//#############################################################################
// TWbMenu
//#############################################################################

function TWbMenu.Add(Caption: string): TWbMenuItem;
begin
  result := TWbMenuItem.Create(self);
  result.Caption.Caption := Caption;
  result.Height := 24;
  if (csReady in ComponentState) then
    Invalidate();
end;

procedure TWbMenu.Resize;
var
  x:  integer;
  dy: integer;
  LCount: integer;
begin
  inherited;

  LCount := GetChildCount();
  if LCount > 0 then
  begin
    for x := 0 to LCount-1 do
    begin
      var LChild := TWbMenuItem( GetChildObject(x) );
      LChild.setBounds(0,dy, clientwidth, LChild.height);
      inc(dy, LChild.Height);
    end;
    self.height := dy;
  end;
end;

//#############################################################################
// TWbMenuItem
//#############################################################################

procedure TWbMenuItem.InitializeObject;
begin
  inherited;
  FCaption := TW3Label.Create(self);
  FGlyph := TW3Image.Create(self);

  FCaption.Font.Color := clBlack;
  FCaption.Font.Name := 'Ubuntu';
  FCaption.Font.Size := 11;
end;

procedure TWbMenuItem.FinalizeObject;
begin
  FCaption.free;
  FGlyph.free;
  inherited;
end;

procedure TWbMenuItem.ObjectReady;
begin
  inherited;
end;

procedure TWbMenuItem.Resize;
var
  wd: integer;
begin
  inherited;
  wd := Clientwidth;
  if FGlyph.Ready then
    dec(wd, FGlyph.PixelWidth);
  FCaption.SetBounds(0,0, wd,clientHeight);
  if FGlyph.ready then
  begin
    FGlyph.SetBounds(wd,0,FGlyph.PixelWidth,clientheight);
  end;
end;

//#############################################################################
// TWbWorkbenchMenuBar
//#############################################################################

procedure TWbWorkbenchMenuBar.InitializeObject;
begin
  inherited;
  FCaption := TW3Label.Create(self);
  FGlyph := TW3Image.Create(self);

  FWbItem := TWbMenuItem.Create(self);
  FWbItem.Caption.Caption :='Workbench';

  FWindowItem := TWbMenuItem.Create(self);
  FWindowItem.Caption.Caption := 'Window';

  FIconsItem := TWbMenuItem.Create(self);
  FIconsItem.Caption.Caption := 'Icons';

  FToolsItem := TWbMenuItem.Create(self);
  FToolsItem.Caption.Caption := 'Tools';

  SetVisibleItems(false);

  FGlyph.LoadFromURL("res/commodore-logo.png");
  FGlyph.ImageFit := fsContain;
  Background.fromColor(clWhite);

  self.OnMouseDown := procedure (Sender: TObject; Button: TMouseButton; Shift: TShiftState; X, Y: integer)
  begin
    if Button = TMouseButton.mbRight then
    begin
      if FActive then
      begin
        Self.SetFocus();
        self.SetCapture();
        HideMenus();
      end else
      begin
        Self.SetFocus();
        self.SetCapture();
        ShowMenus();
      end;
    end;
  end;

  self.OnMouseUp := procedure (Sender: TObject; Button: TMouseButton;
    Shift: TShiftState; X, Y: integer)
  begin
    if Button = TMouseButton.mbRight then
    begin
      self.ReleaseCapture();
      self.DropFocus();
      self.HideMenus();
    end;
  end;

end;

procedure TWbWorkbenchMenuBar.FinalizeObject;
begin
  FGlyph.free;
  FCaption.free;
  FWbItem.free;
  FWindowItem.free;
  FIconsItem.free;
  FToolsItem.free;
  inherited;
end;

procedure TWbWorkbenchMenuBar.ObjectReady;
begin
  inherited;
  FCaption.Font.Color := clBlack;
  FCaption.Font.Name := 'Ubuntu';
  FCaption.Font.Size := 11;
  FCaption.Caption := 'Workbench Screen';
  Height :=  24;
end;

procedure TWbWorkbenchMenuBar.SetVisibleItems(const Value: boolean);
begin
  FWbItem.visible :=Value;
  FWindowItem.visible :=Value;
  FIconsItem.visible :=Value;
  FToolsItem.visible :=Value;
end;

function TWbWorkbenchMenuBar.ShowMenus: boolean;
begin
  if not FActive then
  begin
    FActive := true;
    BeginUpdate;
      FGlyph.Visible := false;
      FCaption.Visible := false;
      SetVisibleItems(true);
      TW3Dispatch.Execute(Invalidate, 100);
    EndUpdate;
    result := true;
  end;
end;

function TWbWorkbenchMenuBar.HideMenus: boolean;
begin
  if FActive then
  begin
    FActive := false;
    BeginUpdate;
      FGlyph.Visible := true;
      FCaption.Visible := true;
      SetVisibleItems(false);
    EndUpdate;
    result := true;
  end;
end;

function TWbWorkbenchMenuBar.Toggle: boolean;
begin
  case FActive of
  true:   HideMenus();
  false:  ShowMenus();
  end;
end;

procedure TWbWorkbenchMenuBar.StyleTagObject;
begin
  inherited;
  Background.FromURL('res/menubar_background.png');
end;

procedure TWbWorkbenchMenuBar.Resize;
var
  dx: integer;
begin
  inherited;
  if not FActive then
  begin
    FGlyph.SetBounds(1,1,ClientHeight-2, ClientHeight-3);
    FCaption.SetBounds(FGlyph.left + FGLyph.width + 2, 0,
    clientwidth, ClientHeight);
  end else
  begin
    var LLayout := [FWbItem, FWindowItem, FIconsItem, FToolsItem];
    dx := 1;
    for var x:=low(LLayout) to high(LLayout) do
    begin
      var wd := LLayout[x].MeasureText(LLayout[x].Caption.Caption).tmWidth;
      LLayout[x].SetBounds(dx,0, wd + 4, clientheight);
      inc(dx, wd);
    end;
  end;
end;

end.

unit SmartCL.ListView;

interface

uses
  System.Widget, W3C.DOM, System.Colors,
  System.Types,
  System.Types.Convert,
  System.Types.Graphics,
  SmartCL.Effects,

  System.Time, SmartCL.Time,

  SmartCL.System, SmartCL.Graphics, SmartCL.Components,

  SmartCL.Css.Classes, SmartCL.Css.StyleSheet,

  SmartCL.Controls.Image,
  SmartCL.Controls.Label,

  SmartCL.Fonts, SmartCL.Borders;

type


  TW3ListItemOptions = set of
    (
      ioBreak,
      ioFullSize
    );

  TW3ListItem = class(TW3CustomControl)
  private
    FOptions: TW3ListItemOptions;
    FSelected: boolean;
    FData:    Variant;
  protected
    procedure SetOptions(NewOptions: TW3ListItemOptions); virtual;
    procedure SetSelected(const NewSelection: boolean); virtual;
    procedure ObjectReady; override;
    procedure StyleTagObject; override;
  public
    class function CreationFlags: TW3CreationFlags; override;
  published
    property  Selected: boolean read FSelected write SetSelected;
    property  Options: TW3ListItemOptions read FOptions write SetOptions;
    property  Data: variant read FData write FData;
  end;

  TW3ListItemPlaque = class(TW3ListItem)
  private
    FCaption: string;
    FText:    string;
    FPadding: integer = 2;
  protected
    procedure Render; virtual;
    procedure SetCaption(const NewCaption: string);
    procedure SetText(const NewText: string);
    procedure SetPadding(NewPadding: integer);

    procedure InitializeObject; override;
    procedure StyleTagObject; override;
    procedure ObjectReady; override;

  published
    property  Padding: integer read FPadding write SetPadding;
    property  Caption: string read FCaption write SetCaption;
    property  Text: string read FText write SetText;
  end;

  TW3ListItemIcon = class(TW3ListItem)
  private
    FGlyph:   TW3Image;
    FText:    TW3Label;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure StyleTagObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  public
    property  Text: TW3Label read FText;
    property  Glyph: TW3Image read FGlyph;
  end;

  TLayoutSelectMask = class(TW3CustomControl)
  protected
    procedure InitializeObject; override;
  end;

  //###########################################################################
  // Layout is pre-calculated. Below are the structures we use to
  // calculate the finaly layout
  //###########################################################################

  // Represent a single item in the layout
  TCLayoutElement = record
    leNode: TW3ListItem;
    leX:  integer;
    leY:  integer;
    class function Create(const Node: TW3ListItem; const x, y: integer): TCLayoutElement;
  end;

  // Represents a row of items
  TCLayoutRow = record
    lrWidth:  integer;
    lrHeight: integer;
    lrCols:   array of TCLayoutElement;
  end;

  // Represents the full items of rows in the layout
  TCLayout = record
    clRows: Array of TCLayoutRow;
  end;

  TLayoutView = class(TW3CustomControl)
  private
    FSpacing:     integer = 10;
    FActive:      boolean;
    FSelectMask:  TLayoutSelectMask = nil;
    function  GetSelectMask: TLayoutSelectMask;

    function CheckMouseInElement(const Xpos, Ypos: integer): boolean;

    function  CalculateLayout: TCLayout;

  protected
    property  SelectMask: TLayoutSelectMask read GetSelectMask;

    procedure MouseDown(button : TMouseButton;
      shiftState : TShiftState;x, y : integer); override;

    procedure MouseMove(shiftState : TShiftState; x, y : integer); override;

    procedure MouseUp(button : TMouseButton;
      shiftState : TShiftState; x, y : integer); override;

  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure Resize; override;
  end;


implementation

//#############################################################################
// TCLayoutElement
//#############################################################################

class function TCLayoutElement.Create(const Node: TW3ListItem;
  const x, y: integer): TCLayoutElement;
begin
  result.leNode := Node;
  result.leX := x;
  result.leY := y;
end;

//#############################################################################
// TW3ListItemPlaque
//#############################################################################

procedure TW3ListItemPlaque.InitializeObject;
begin
  inherited;
  Options := [ioFullSize];
end;

procedure TW3ListItemPlaque.StyleTagObject;
begin
  inherited;
  Font.Name := 'Ubuntu';
  BorderRadius:=8;
  SetPadding(2);
  self.Border.Style := besDotted;
  self.Border.Size := 4;
  Self.Border.Color := clWhite;
end;

procedure TW3ListItemPlaque.ObjectReady;
begin
  inherited;
  if FPadding > 0 then
  begin
    var LTemp := FPadding;
    FPadding := 0;
    SetPadding(LTemp);
    Invalidate;
  end;
end;

procedure TW3ListItemPlaque.SetPadding(NewPadding: integer);
begin
  if NewPadding <> FPadding then
  begin
    BeginUpdate;
    FPadding := TInteger.EnsureRange(NewPadding, 0, MAX_INT);
    Handle.style['padding'] := TInteger.ToPxStr(FPadding);
    AddToComponentState([csSized]);
    EndUpdate;
  end;
end;

procedure TW3ListItemPlaque.SetCaption(const NewCaption: string);
begin
  if NewCaption <> FCaption then
  begin
    BeginUpdate;
    FCaption := NewCaption;
    AddToComponentState([csSized]);
    EndUpdate;
    TW3Dispatch.RequestAnimationFrame( Render );
  end;
end;

procedure TW3ListItemPlaque.SetText(const NewText: string);
begin
  if NewText <> FText then
  begin
    BeginUpdate;
    FText := NewText;
    AddToComponentState([csSized]);
    EndUpdate;
    TW3Dispatch.RequestAnimationFrame( Render );
  end;
end;

procedure TW3ListItemPlaque.Render;
var
  LText:  string;
begin
  LText := #'<table width="100%" height="100%" border="1" >
             <tr>
              <td width="80px" halign="center">
                $DATA1$
              </td>

              <td width="*" valign="top">
              $DATA2$
              </td>
             </tr>
             </table>';

  LText := StrReplace(LText,'$DATA1$',
      #'<img src="/res/devball.png" align="left" width="80px" style="
            object-fit: contain;
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            ">');

  InnerHTML := StrReplace(LText,'$DATA2$',
      #'<p><font color=#888888><b>' + Caption + '</b></p>'
      + '<p><font color=#FFFFFF>' + Text + '<p>'
      );
end;

//#############################################################################
// TW3ListItem
//#############################################################################

procedure TW3ListItem.StyleTagObject;
begin
  inherited;
  Handle.style['min-width'] := '64px';
  Handle.style['min-height'] := '64px';
end;

procedure TW3ListItem.ObjectReady;
begin
  inherited;
  if FSelected then
  begin
    FSelected := false;
    SetSelected(true);
    Invalidate;
  end;
end;

class function TW3ListItem.CreationFlags: TW3CreationFlags;
begin
  result := inherited CreationFlags();
  Include(result, cfAllowSelection);
  Include(result, cfKeyCapture);
end;

procedure TW3ListItem.SetSelected(const NewSelection: boolean);
begin
  if (csReady in ComponentState) then
  begin
    BeginUpdate;
    FSelected := NewSelection;
    AddToComponentState([csSized]);

    case FSelected of
    true:   self.Background.FromColor(clRed);
    false:  self.Background.FromColor(clGreen);
    end;
    EndUpdate;
  end else
  FSelected := NewSelection;
end;

procedure TW3ListItem.SetOptions(NewOptions: TW3ListItemOptions);
begin
  // fullsize includes break, so remove that
  if (ioFullSize in NewOptions) then
    Exclude(NewOptions, ioBreak);

  FOptions := NewOptions;
end;

//#############################################################################
// TW3ListItemIcon
//#############################################################################

procedure TW3ListItemIcon.InitializeObject;
begin
  inherited;
  FGlyph := TW3Image.Create(self);
  FGlyph.OnMouseDown := self.onMouseDown;

  FText := TW3Label.Create(self);
  FText.onMouseDown := self.OnMouseDown;

  self.Background.FromColor(clGreen);

  FText.width := 100;
  FText.height := 22;
  FText.Caption :='Noname';
  FText.AlignText:= TTextAlign.taCenter;

  FText.Font.Name := 'Ubuntu';
  FText.Font.Size := 12;
  FText.Font.Color := clWhite;
  FText.Container.TextShadow.Shadow(1,1,2,$000000);

  w3_setStyle(FText.Handle, 'min-width', '64px');
  w3_setStyle(FText.Handle, 'min-height', '22px');

end;

procedure TW3ListItemIcon.FinalizeObject;
begin
  FGlyph.free;
  FText.free;
  inherited;
end;

procedure TW3ListItemIcon.StyleTagObject;
begin
  inherited;
  // set the bare-minimum size
  w3_setStyle(Handle, 'min-width', '80px');
  w3_setStyle(Handle, 'min-height', '88px');
end;

procedure TW3ListItemIcon.ObjectReady;
begin
  inherited;
  //FGlyph.LoadFromURL('/res/sys_n.png');
  self.Selected := true;
end;

procedure TW3ListItemIcon.Resize;
var
  dx, dy: integer;
begin
  inherited;
  dx := (clientwidth div 2) - (FGlyph.PixelWidth div 2);
  FGlyph.MoveTo(dx, 0);

  FText.width := FText.Container.Width;

  inc(dy, FGlyph.height);
  dx := (clientwidth div 2) - (FText.width div 2);
  FText.SetBounds(dx,dy, FText.width, FText.Height);
end;

//#############################################################################
// TLayoutSelectMask
//#############################################################################

procedure TLayoutSelectMask.InitializeObject;
begin
  inherited;
  Border.Style := besDotted;
  Border.Size := 2;
  Handle.style['border-radius'] := '1px';
  Border.Color := clBlack;
  Background.FromColor(clNone);
end;

//#############################################################################
// TLayoutView
//#############################################################################

procedure TLayoutView.InitializeObject;
begin
  inherited InitializeObject;
  // Force CB-xyz handlers to be mapped
  self.OnMouseDown := nil;
  self.OnMouseMove := nil;
  self.OnMouseUp := nil;
end;

procedure TLayoutView.FinalizeObject;
begin
  if FSelectMask <> nil then
    FSelectMask.free;
  inherited;
end;

function TLayoutView.GetSelectMask: TLayoutSelectMask;
begin
  if FSelectMask = nil then
  begin
    FSelectMask := TLayoutSelectMask.Create(self);
    FSelectMask.TagStyle.Add( TSuperStyle.AnimGlow(clBlack, clWhite) );
  end;
  result := FSelectMask;
end;

function TLayoutView.CheckMouseInElement(const Xpos, Ypos: integer): boolean;
var
  LCount: integer;
  LChild: TW3CustomControl;
begin
  LCount := GetChildCount();
  if LCount > 0 then
  begin
    result := false;
    for var x := 0 to LCount-1 do
    begin
      LChild := TW3CustomControl( GetChildObject(x) );
      if not (LChild is TLayoutSelectMask) then
      begin
        result := LChild.BoundsRect.ContainsPos(xpos,ypos);
        if result then
        break;
      end;
    end;
  end else
  result := false;
end;

procedure TLayoutView.MouseDown(button : TMouseButton; shiftState : TShiftState;x, y : integer);
begin
  inherited MouseDown(Button, ShiftState, x, y);
  if Button = mbLeft then
  begin
    if not CheckMouseInElement(x, y) then
    begin
      FActive := true;
      SetCapture();
      var LMask := GetSelectMask();
      LMask.MoveTo(x, y);
    end;
  end;
end;

procedure TLayoutView.MouseMove(shiftState : TShiftState; x, y : integer);
var
  LMask: TLayoutSelectMask;
  wd, hd: integer;
begin
  Inherited MouseMove(ShiftState, x, y);
  if FActive then
  begin
    LMask := GetSelectMask();
    wd := x - LMask.left;
    hd := y - LMask.Top;
    LMask.SetBounds(LMask.left, LMask.Top, wd, hd);
  end;
end;

procedure TLayoutView.MouseUp(button: TMouseButton; shiftState: TShiftState; x, y: integer);
begin
  inherited MouseUp(Button, ShiftState, x, y);
  if FActive then
  begin
    FActive := false;
    ReleaseCapture();
    var LTemp := FSelectMask;
    FSelectMask := nil;
    LTemp.fxFadeOut(0.299, procedure()
      begin
        LTemp.free;
        LTemp := nil;
      end);
  end;
end;

function TLayoutView.CalculateLayout: TCLayout;
var
  x, LCount:  integer;
  LRowHeight: integer;
  dx, dy:     integer;
  LChild:     TW3ListItem;
  LStack:     Array of TCLayoutElement;

  procedure StackToRow;
  var
    LRow:     TCLayoutRow;
    LWidth:   integer;
    LHeight:  integer;
  begin
    LHeight := 0;
    LWidth  := 0;
    while LStack.Count > 0 do
    begin
      var LTemp := LStack.Pop();
      if LTemp.leNode.height > LHeight then
        LHeight := LTemp.leNode.height;
      inc(LWidth, LTemp.leNode.Width + FSpacing);
      LRow.lrCols.Add( LTemp );
    end;

    if LWidth > 0 then
      inc(LWidth, FSpacing);

    LRow.lrHeight := LHeight;
    LRow.lrWidth := LWidth;

    result.clRows.Add(LRow);
    LStack.Clear();
  end;

begin
  LCount := GetChildCount();
  x := 0;
  dx := FSpacing;
  dy := FSpacing;

  while x < LCount do
  begin
    LChild := TW3ListItem( GetChildObject(x) );

    // Child breaks row population?
    if (ioBreak in LChild.Options) then
    begin
      if LChild.height > LRowHeight then
      LRowHeight := LChild.Height;

      LStack.add( TCLayoutElement.Create(LChild, dx, dy) );
      StackToRow();

      dx := FSpacing;
      inc(dy, LRowHeight);
      inc(dy, FSpacing);

      inc(x);
      continue;
    end;

    // Child should scale to full width?
    if (ioFullSize in LChild.Options) then
    begin
      // Put whatever we have collected in a row
      StackToRow();

      dx := FSpacing;

      inc(dy, LRowHeight);
      inc(dy, FSpacing);

      LStack.add( TCLayoutElement.Create(LChild, dx, dy) );
      inc(dy, LChild.Height);
      inc(dy, FSpacing);

      LRowHeight := 0;
      inc(x);

      // Push single item onto the stack
      StackToRow();

      continue;
    end;

    if dx + LChild.Width + FSpacing > ClientWidth then
    begin
      StackToRow();
      dx := FSpacing;
      inc(dy, LRowHeight);
      inc(dy, FSpacing);
    end;

    if LChild.height > LRowHeight then
      LRowHeight := LChild.Height;

    LStack.add( TCLayoutElement.Create(LChild, dx, dy) );
    inc(dx, LChild.Width);

    if x < (LCount-1) then
      inc(dx, FSpacing);

    inc(x);
  end;

  if LStack.Count > 0 then
    StackToRow();
end;

procedure TLayoutView.Resize;
var
  x: integer;
  y: integer;
  dx,dy: integer;
  LLayout: TCLayout;
  LRow: TCLayoutRow;
begin
  LLayout := CalculateLayout();

  if LLayout.clRows.Count <1 then
    exit;

  for x:=low(LLayout.clRows) to high(LLayout.clRows) do
  begin
    LRow := LLayout.clRows[x];

    for y:=0 to LRow.lrCols.Length-1 do
    begin
      var LItem := LRow.lrCols[y].leNode;
      dx := LRow.lrCols[y].leX;
      dy := LRow.lrCols[y].leY;

      if (ioFullSize in LItem.Options) then
      begin
        LItem.SetBounds(dx, dy, clientwidth - (FSpacing * 2), LItem.Height);
      end else
      LItem.MoveTo(dx, dy);

    end;
  end;
end;

end.

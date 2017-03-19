unit wb.desktop.iconview;

interface

  {$DEFINE DEBUG}

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

  SmartCL.Borders, SmartCL.Time,
  SmartCL.Effects,
  SmartCL.System, SmartCL.Graphics, SmartCL.Components,
  SmartCL.Css.Classes, SmartCL.Css.StyleSheet,
  SmartCL.Controls.Image,
  SmartCL.Controls.Label,
  SmartCL.Fonts;

type


  TWbListItemOptions = set of
    (
      ioBreak,
      ioFullSize
    );

  TWbListItem = class(TWbCustomControl)
  private
    FOptions: TWbListItemOptions;
    FSelected: boolean;
    FData:    Variant;
  protected
    procedure SetOptions(NewOptions: TWbListItemOptions); virtual;
    procedure SetSelected(const NewSelection: boolean); virtual;
    procedure ObjectReady; override;
    procedure StyleTagObject; override;
  public
    class function CreationFlags: TW3CreationFlags; override;
  published
    property  Selected: boolean read FSelected write SetSelected;
    property  Options: TWbListItemOptions read FOptions write SetOptions;
    property  Data: variant read FData write FData;
    property  OnSelected: TNotifyEvent;
    property  OnUnSelected: TNotifyEvent;
  end;

  TWbListItemPlaque = class(TWbListItem)
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

  TWbListItemIcon = class(TWbListItem)
  private
    FGlyph:   TW3Image;
    FText:    TW3Label;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure StyleTagObject; override;
    procedure Resize; override;
  public
    property  Text: TW3Label read FText;
    property  Glyph: TW3Image read FGlyph;
  end;

  TWbLayoutSelectMask = class(TWbCustomControl)
  protected
    procedure InitializeObject; override;
  end;

  //###########################################################################
  // Layout is pre-calculated. Below are the structures we use to
  // calculate the finaly layout
  //###########################################################################

  // Represent a single item in the layout
  TCLayoutElement = record
    leNode: TWbListItem;
    leX:  integer;
    leY:  integer;
    class function Create(const Node: TWbListItem; const x, y: integer): TCLayoutElement;
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

  TWbIconViewItemSelectEvent = procedure (Sender: TObject; const NewItem, OldItem: TWbListItem);

  TWbIconView = class(TWbCustomControl)
  private
    FOnItemSelect: TWbIconViewItemSelectEvent;
    FSpacing:     integer = 10;
    FActive:      boolean;
    FStartPos:    TPoint;
    FSelectMask:  TWbLayoutSelectMask = nil;
    FSelectItem:  TWbListItem;

    function  GetSelectMask: TWbLayoutSelectMask;
    function  CheckMouseInElement(const Xpos, Ypos: integer): TW3CustomControl;
    function  CalculateLayout: TCLayout;

  protected
    property  SelectMask: TWbLayoutSelectMask read GetSelectMask;

    procedure MouseDown(button : TMouseButton;
      shiftState : TShiftState;x, y : integer); override;

    procedure MouseMove(shiftState : TShiftState; x, y : integer); override;

    procedure MouseUp(button : TMouseButton;
      shiftState : TShiftState; x, y : integer); override;

  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  public
    property  SelectedItem: TWbListItem read FSelectItem;

    class function CreationFlags: TW3CreationFlags; override;

    procedure ClearSelected;

  published
    property OnItemSelected: TWbIconViewItemSelectEvent read FOnItemSelect write FOnItemSelect;
  end;


implementation

//#############################################################################
// TCLayoutElement
//#############################################################################

class function TCLayoutElement.Create(const Node: TWbListItem;
  const x, y: integer): TCLayoutElement;
begin
  result.leNode := Node;
  result.leX := x;
  result.leY := y;
end;

//#############################################################################
// TW3ListItemPlaque
//#############################################################################

procedure TWbListItemPlaque.InitializeObject;
begin
  inherited;
  Options := [ioFullSize];
end;

procedure TWbListItemPlaque.StyleTagObject;
begin
  inherited;
  Font.Name := 'Ubuntu';
  BorderRadius:=8;
  SetPadding(2);
end;

procedure TWbListItemPlaque.ObjectReady;
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

procedure TWbListItemPlaque.SetPadding(NewPadding: integer);
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

procedure TWbListItemPlaque.SetCaption(const NewCaption: string);
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

procedure TWbListItemPlaque.SetText(const NewText: string);
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

procedure TWbListItemPlaque.Render;
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
      #'<img src="res/devball.png" align="left" width="80px" style="
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
// TWbListItem
//#############################################################################

procedure TWbListItem.StyleTagObject;
begin
  inherited;
  Handle.style['min-width'] := '64px';
  Handle.style['min-height'] := '64px';
end;

procedure TWbListItem.ObjectReady;
begin
  inherited;
  if FSelected then
  begin
    FSelected := false;
    Invalidate;
  end;
end;

class function TWbListItem.CreationFlags: TW3CreationFlags;
begin
  result := inherited CreationFlags();
  Include(result, cfAllowSelection);
  Include(result, cfKeyCapture);
end;

procedure TWbListItem.SetSelected(const NewSelection: boolean);
begin
  if (csReady in ComponentState) then
  begin
    BeginUpdate;
    FSelected := NewSelection;
    AddToComponentState([csSized]);

    case NewSelection of
    true:
      begin
        Handle.style['outline-width'] := '1px';
        Handle.style['outline-style'] := 'dotted';
        Handle.style['outline-color'] := '#000000';
      end;
    false:
      begin
        Handle.style['outline-width'] := '0px';
        Handle.style['outline-style'] := 'hidden';
        Handle.style['outline-color'] := 'transparent';
      end;
    end;

    EndUpdate;
  end else
  FSelected := NewSelection;
end;

procedure TWbListItem.SetOptions(NewOptions: TWbListItemOptions);
begin
  // fullsize includes break, so remove that
  if (ioFullSize in NewOptions) then
    Exclude(NewOptions, ioBreak);

  FOptions := NewOptions;
end;

//#############################################################################
// TWBListItemIcon
//#############################################################################

procedure TWbListItemIcon.InitializeObject;
begin
  inherited;
  FGlyph := TW3Image.Create(self);

  FGlyph.Width := 64;
  FGlyph.Height := 64;

  FText := TW3Label.Create(self);
  FText.width := 100;
  FText.height := 20;
  FText.Caption :='Noname';
  FText.AlignText:= TTextAlign.taCenter;

  FText.Font.Name := 'Ubuntu';
  FText.Font.Size := 12;
  FText.Font.Color := clBlack;

  self.Background.FromColor(clNone);
end;

procedure TWbListItemIcon.FinalizeObject;
begin
  FGlyph.free;
  FText.free;
  inherited;
end;

procedure TWbListItemIcon.StyleTagObject;
begin
  inherited;
  // set the bare-minimum size
  w3_setStyle(Handle, 'min-width', '76px');
  w3_setStyle(Handle, 'min-height', '84px');
end;

procedure TWbListItemIcon.ObjectReady;
begin
  inherited;
  SetSize(76, 84);
end;

procedure TWbListItemIcon.Resize;
var
  dx, dy: integer;
begin
  inherited;
  dx := (clientwidth div 2) - (FGlyph.width div 2);
  FGlyph.MoveTo(dx, 4);

  FText.width := FText.Container.Width;

  inc(dy, FGlyph.top + FGlyph.height);
  dx := (clientwidth div 2) - (FText.width div 2);
  FText.SetBounds(dx,dy, FText.width, FText.Height);
end;

//#############################################################################
// TWbLayoutSelectMask
//#############################################################################

procedure TWbLayoutSelectMask.InitializeObject;
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

procedure TWbIconView.InitializeObject;
begin
  inherited InitializeObject;
  // Force CB-xyz handlers to be mapped, that way we can
  // safely override the default handlers (below)
  self.OnMouseDown := nil;
  self.OnMouseMove := nil;
  self.OnMouseUp := nil;
  self.OnKeyPress := nil;
end;

procedure TWbIconView.FinalizeObject;
begin
  if FSelectMask <> nil then
    FSelectMask.free;
  inherited;
end;

procedure TWbIconView.ObjectReady;
begin
  inherited;
end;

class function TWbIconView.CreationFlags: TW3CreationFlags;
begin
  result := inherited CreationFlags();
  Include(result, cfAllowSelection);
end;

function TWbIconView.GetSelectMask: TWbLayoutSelectMask;
begin
  if FSelectMask = nil then
  begin
    FSelectMask := TWbLayoutSelectMask.Create(self);
    FSelectMask.TagStyle.Add( TSuperStyle.AnimGlow(clBlack, clWhite) );
  end;
  result := FSelectMask;
end;

function TWbIconView.CheckMouseInElement(const Xpos, Ypos: integer): TW3CustomControl;
var
  LCount: integer;
  LChild: TW3CustomControl;
begin
  LCount := GetChildCount();
  if LCount > 0 then
  begin
    for var x := 0 to LCount-1 do
    begin
      LChild := TW3CustomControl( GetChildObject(x) );
      if not (LChild is TWbLayoutSelectMask) then
      begin
        if LChild.BoundsRect.ContainsPos(xpos,ypos) then
        begin
          result := TWbListItem(LChild);
          break;
        end;
      end;
    end;
  end;
end;

procedure TWbIconView.ClearSelected;
begin
  if (csReady in ComponentState) then
  begin
    if not (csDestroying in ComponentState) then
    begin

      if (FSelectItem <> nil) then
      begin
        if assigned(FSelectItem.OnUnSelected) then
        begin
          FSelectItem.OnUnSelected(FSelectItem);
        end;
      end;

      if assigned(FOnItemSelect) then
      begin
        FOnItemSelect(self, nil, FSelectItem );
      end;

      FSelectItem := nil;
    end;
  end;
end;

procedure TWbIconView.MouseDown(button : TMouseButton; shiftState : TShiftState;x, y : integer);
var
  LItem: TW3CustomControl;
begin
  inherited MouseDown(Button, ShiftState, x, y);

  var LAccess: IWbDesktop;
  LAccess := GetDesktop() as IWbDesktop;

  if Button = mbLeft then
  begin
    // Did we hit an ICON?
    LItem := CheckMouseInElement(x, y);

    if LItem = nil then
    begin
      Self.SetFocus();

      var LDomFocus := null;
      asm
        @LDOMFocus = document.querySelector(":focus");
      end;
      if (LDomFocus) then
      begin
        if LDomFocus <> self.handle then
        begin
          LDomFocus.blur();
          TW3ControlTracker.SetFocusedControl(nil);
          self.handle.focus();
        end;
      end;

      var LEd := TW3ControlTracker.GetFocusedControl;
      if LEd <> self then
      begin
        if Led <> nil then
        begin
          var LCtrl := TW3CustomControl(LEd);
          LCtrl.Handle.blur();
          if assigned(LCtrl.OnLostFocus) then
            LCtrl.OnLostFocus(LEd);
        end;
      end;

      try
        {$IFDEF DEBUG}
        writeln("Could not find an icon at this location");
        {$ENDIF}

        if LAccess.IsDesktop(self) then
        begin
          var LWin := LAccess.GetActiveWindow();
          if LWin <> nil then
          begin
            {$IFDEF DEBUG}
            writeln("A window is registered as active, issuing a blur() call");
            {$ENDIF}
            LWin.Handle.blur();

            {$IFDEF DEBUG}
            writeln("Firing its LostFocus event if set");
            {$ENDIF}
            if assigned(LWin.OnLostFocus) then
              LWin.OnLostFocus(LWin);

            // Ok thats done, make sure we dont repeat it
            LAccess.SetFocusedWindow(NIL);
          end
          {$IFDEF DEBUG}
          else
          writeln("No window registered as active")
          {$ENDIF}
          ;
        end
        {$IFDEF DEBUG}
        else
        writeln("We are not a desktop!!")
        {$ENDIF}
        ;

        FActive := true;
        ClearSelected();
        SetFocus();
        SetCapture();
        FStartPos := TPoint.Create(x, y);
      except
        on e: exception do
        begin
          writeln("HERE->" + e.message);
        end;
      end;
    end else
    begin
      // An icon was hit
      if (LItem is TWbListItem) then
      begin
        if (LItem is TWbListItemIcon) then
        begin
          // Give the icon the focus
          LItem.Setfocus();
        end;

        if assigned(FSelectItem) then
        begin
          // Same one? Just exit
          if FSelectItem = LItem then
          exit;

          if assigned(FSelectItem.OnUnSelected) then
          begin
            FSelectItem.OnUnSelected(FSelectItem);
            FSelectItem.Selected := false;
          end;
        end;

        if assigned(FOnItemSelect) then
        FOnItemSelect(self, TWbListItem(LItem), FSelectItem );

        FSelectItem := TWbListItem(LItem);
        FSelectItem.Selected := true;

        if assigned(FSelectItem.OnSelected) then
        FSelectItem.OnSelected(FSelectItem);
      end else
      begin
        (* OK, a control has been selected - but its either not a
           child item - or a child's sub-item. Hence we need to fire
           off the unselect events and mark the selected item as NIL *)
        (* var LWin := LAccess.GetActiveWindow();
        if LWin <> nil then
        begin
          //Showmessage( TWbWindow(LWin).Header.Title.Caption);
        end else
        writeln("God dammit!"); *)

        ClearSelected();

        (* OK, lets try to learn something about the selected
           child element. Its obviously not a TWbListItem *)
        if QueryChildInThisBranch(LItem) then
        begin
          if (LItem.Parent is TWbListItem)
          or (LItem.Parent is TWbListItemIcon) then
          begin
            {$IFDEF DEBUG}
            writeln("Same branch, selecting parent icon");
            {$ENDIF}
            var TopOwner := TWbListItem(LItem.Parent);
            TopOwner.Selected := not TopOwner.Selected;
          end else
          begin
            {$IFDEF DEBUG}
            writeln("Unknown parent <" + LItem.Parent.ClassName + ">");
            {$ENDIF}
          end;
        end else
        begin
          {$IFDEF DEBUG}
          writeln(LItem.classname + " was selected somehow ..");
          {$ENDIF}
        end;
      end;
    end;
  end;
end;

procedure TWbIconView.MouseMove(shiftState : TShiftState; x, y : integer);
var
  LRect:  TRect;
begin
  Inherited MouseMove(ShiftState, x, y);

  if FActive then
  begin
    (* Only setup mask if the pointer has moved *)
    if  (x <> FStartPos.x)
    and (y <> FStartPos.y)
    and (FSelectMask = nil) then
    begin
      FSelectMask := GetSelectMask();
      FSelectMask.MoveTo(FStartPos.x, FStartPos.y);
    end;

    if FSelectMask <> nil then
    begin
      LRect.left := if x < FStartPos.x then x else FStartPos.x;
      LRect.top := if y < FStartPos.y then y else FStartpos.y;
      LRect.right := if x > FStartPos.x then x else FStartPos.x;
      LRect.bottom := if y > FStartPos.y then y else FStartpos.y;
      FSelectMask.SetBounds(LRect);
    end;
  end;

end;

procedure TWbIconView.MouseUp(button: TMouseButton; shiftState: TShiftState; x, y: integer);
begin
  inherited MouseUp(Button, ShiftState, x, y);
  if FActive then
  begin
    FActive := false;
    ReleaseCapture();

    if FSelectMask <> nil then
    begin
      var LTemp := FSelectMask;
      FSelectMask := nil;
      LTemp.fxFadeOut(0.299, procedure()
      begin
        LTemp.free;
      end);
    end;

  end;
end;

function TWbIconView.CalculateLayout: TCLayout;
var
  x, LCount:  integer;
  LRowHeight: integer;
  dx, dy:     integer;
  LChild:     TWbListItem;
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
    LChild := TWbListItem( GetChildObject(x) );

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

procedure TWbIconView.Resize;
var
  x: integer;
  y: integer;
  dx,dy: integer;
  LLayout: TCLayout;
  LRow: TCLayoutRow;
begin
  inherited;

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

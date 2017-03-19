unit wb.desktop.window;

interface

uses
  W3C.DOM,
  System.Widget,
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

  wb.desktop.types,
  wb.desktop.iconView,
  wb.desktop.preferences,

  SmartCL.System,
  SmartCl.MouseCapture,
  SmartCL.MouseTouch,
  SmartCL.Time,
  SmartCL.Controls.Elements,
  SmartCL.Graphics, SmartCL.Components,
  SmartCL.Effects, SmartCL.Fonts, SmartCL.Borders,
  SmartCL.CSS.Classes, SmartCL.CSS.StyleSheet,

  SmartCL.Controls.Image, SmartCL.Controls.Label,
  SmartCL.Controls.Panel, SmartCL.Controls.Button,
  SMartCL.Controls.Scrollbar,
  SMartCL.Controls.ToggleSwitch, SmartCL.Controls.Toolbar;

type

  TWbWindowCloseGlyph = class(TWbWindowGlyph)
  end;

  TWbWindowZOrderGlyph = class(TWbWindowGlyph)
  end;

  TWbWindowMinimizeGlyph = class(TWbWindowGlyph)
  end;

  TWbWindowSizerGlyph = class(TWbWindowGlyph)
  end;

  TWbWindowHeader = class(TWbWindowElement)
  private
    FTitle:     TW3Label;
    FClose:     TWbWindowCloseGlyph;
    FZOrder:    TWbWindowZOrderGlyph;
    FMinimize:  TWbWindowMinimizeGlyph;
  protected
    procedure HandleTitleChanged(Sender: TObject);
  protected
    { procedure MouseDown(button: TMouseButton; shiftState: TShiftState; x, y: integer); override;
    procedure MouseMove(shiftState: TShiftState; x, y: integer); override;
    procedure MouseUp(button: TMouseButton; shiftState: TShiftState; x, y: integer); override;    }
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure Resize; override;
    procedure ObjectReady; override;
  public
    property  CloseGlyph: TWbWindowCloseGlyph read FClose;
    property  MinimizeGlyph: TWbWindowMinimizeGlyph read FMinimize;
    property  ZOrderGlyph: TWbWindowZOrderGlyph read FZOrder;
    property  Title: TW3Label read FTitle;
  end;

  TWbWindowLeftSide = class(TWbWindowElement)
  end;

  TWbWindowRightSide = class(TWbWindowElement)
  private
    FScrollbar: TW3VerticalScrollbar;
  protected
    procedure FinalizeObject; override;
    procedure Resize; override;
  public
    property  Scrollbar: TW3VerticalScrollbar read FScrollbar;
    procedure ShowScrollbar;
    procedure HideScrollbar;
    function  GetCalculatedWidth: integer;
  end;

  TWbWindowFooter = class(TWbWindowElement)
  private
    FScrollbar: TW3HorizontalScrollbar;
  protected
    procedure FinalizeObject; override;
    procedure Resize; override;
  public
    property  Scrollbar: TW3HorizontalScrollbar read FScrollbar;
    procedure ShowScrollbar;
    procedure HideScrollbar;
    function  GetCalculatedHeight: integer;
  end;

  TW3WindowFocusBlock = class(TWbWindowElement)
  end;

  TWbWindowContent = class(TWbWindowElement)
  private
    FPermanent: boolean;
    FBlocker:   TW3WindowFocusBlock;
    FOldSelect: TW3ContentSelectionMode;
  protected
    procedure FinalizeObject; override;
    procedure Resize; override;
  public
    property  InputDisabledPermanent: boolean read FPermanent;
    function  InputDisabled: boolean;
    procedure DisableInput(const BlockPermanent: boolean);
    procedure EnableInput;
  published
    property  OnInputDisabled: TNotifyEvent;
    property  OnInputEnabled: TNotifyEvent;
  end;

  TWbWindowMoveBeginsEvent  = TNotifyEvent;
  TWbWindowMoveEndsEvent    = TNotifyEvent;
  TWbWindowSizeBeginsEvent  = TNotifyEvent;
  TWbWindowSizeEndsEvent    = TNotifyEvent;

  TWbWindowOptions = set of (woSizeable, woHScroll, woVScroll);

  TWbCustomWindow = partial class(TWbCustomControl)
  private
    FHeader:      TWbWindowHeader;
    FLeft:        TWbWindowLeftSide;
    FRight:       TWbWindowRightSide;
    FFooter:      TWbWindowFooter;
    FContent:     TWbWindowContent;
    FSizer:       TWbWindowSizerGlyph;
    FMoveActive:  boolean;
    FSizeActive:  boolean;
    FStartPos:    TPoint;
    FOptions:     TWbWindowOptions;
    FOldSize:     TRect; // Size of window before maximize
    FStyled:      boolean;
  protected
    procedure HandleCloseClick(Sender: TObject); virtual;
    procedure HandleZOrderClick(Sender: TObject); virtual;
    procedure HandleMinimizeClick(Sender: TObject); virtual;
    procedure HandleGotFocus(Sender: TObject); virtual;

    procedure SetOptions(const NewOptions: TWbWindowOptions); virtual;

  protected
    procedure HandleMouseDown(Sender: TObject; Button: TMouseButton;
              Shift: TShiftState; X, Y: integer); virtual;

    procedure HandleMouseMove(Sender: TObject;
              Shift: TShiftState; X, Y: integer); virtual;

    procedure HandleMouseUp(Sender: TObject; Button: TMouseButton;
              Shift: TShiftState; X, Y: integer); virtual;
  protected
    procedure InitializeObject; override;
    procedure FinalizeObject; override;
    procedure ObjectReady; override;
    procedure Resize; override;
  public
    property  Content: TWbWindowContent read FContent;
    property  Header: TWbWindowHeader read FHeader;
    property  Footer: TWbWindowFooter read FFooter;
    property  Sizer: TWbWindowSizerGlyph read FSizer;
    property  Styled: boolean read FStyled;

    procedure StyleAsFocused;
    procedure StyleAsUnFocused;

    procedure UnSelect;

    class function CreationFlags: TW3CreationFlags; override;

    procedure CloseWindow;
  published
    property  Options: TWbWindowOptions read FOptions write SetOptions;
    property  OnMoveBegins:   TWbWindowMoveBeginsEvent;
    property  OnMoveEnds:     TWbWindowMoveEndsEvent;
    property  OnReSizeBegins: TWbWindowSizeBeginsEvent;
    property  OnReSizeEnds:   TWbWindowSizeEndsEvent;
  end;


  TWbWindow = class(TWbCustomWindow)
  protected
    procedure HandleMouseDown(Sender: TObject; Button: TMouseButton;
              Shift: TShiftState; X, Y: integer); override;
  end;



  TWbExternalWindowOptions = set of (eoAllowFocus, eoCheckFrameFocus);

  TWbExternalWindow = class(TWbCustomWindow)
  private
    FURL:     string;
    FFrame:   TW3IFrameHTMLElement;
    FOptions: TWbExternalWindowOptions;
    function  FrameHasFocus: boolean;
  protected
    function  QueryChildInThisBranch(Child: TW3TagContainer): boolean; override;
  public
    property  RemoteURL: string read FURL;
    property  RemoteOptions: TWbExternalWindowOptions read FOptions;
    procedure OpenURL(const FullURL: string; const Options: TWbExternalWindowOptions);
    procedure CloseUrl;
  end;

implementation

//#############################################################################
// TWbWindowRightSide
//#############################################################################

procedure TWbWindowRightSide.FinalizeObject;
begin
  if FScrollbar <> nil then
  FScrollbar.free;
  inherited;
end;

function TWbWindowRightSide.GetCalculatedWidth: integer;
begin
  if FScrollbar <> nil then
    result := FScrollbar.width
  else
    result := 0;
end;

procedure TWbWindowRightSide.ShowScrollbar;
begin
  if FScrollbar = nil then
  begin
    FScrollbar := TW3VerticalScrollbar.Create(self);
    FScrollbar.Total := 2000;
    FScrollbar.PageSize := 600;
    FScrollbar.Position := 200;
    FScrollbar.HandlePadding := 1;
    FScrollbar.MinButton.InnerHtml := '';
    FScrollbar.MaxButton.InnerHtml := '';
    FScrollbar.MinButton.Background.FromURL('res/btnup.png');
    FScrollbar.MaxButton.Background.FromURL('res/btndown.png');
    FScrollbar.DragHandle.StyleClass := 'TW3ScrollbarHandleV';
  end;
end;

procedure TWbWindowRightSide.HideScrollbar;
begin
  if FScrollbar <> nil then
  begin
    try
      FScrollbar.free;
    finally
      FScrollbar:=nil;
    end;
    invalidate;
  end;
end;

procedure TWbWindowRightSide.Resize;
var
  dx: integer;
begin
  inherited;
  if FScrollbar <> nil then
  begin
    dx := (ClientWidth div 2) - 8;
    FScrollbar.SetBounds(dx, 0, 16, ClientHeight);
  end;
end;

//#############################################################################
// TWbWindowFooter
//#############################################################################

procedure TWbWindowFooter.FinalizeObject;
begin
  if FScrollbar <> nil then
  FScrollbar.free;
  inherited;
end;

function TWbWindowFooter.GetCalculatedHeight: integer;
begin
  if FScrollbar <> nil then
    result := FScrollbar.height
  else
    result := 0;
end;

procedure TWbWindowFooter.ShowScrollbar;
begin
  if FScrollbar = nil then
  begin
    FScrollbar := TW3HorizontalScrollbar.Create(self);
    FScrollbar.Total := 2000;
    FScrollbar.PageSize := 600;
    FScrollbar.Position := 200;
    FScrollbar.HandlePadding := 1;
    FScrollbar.MinButton.InnerHtml := '';
    FScrollbar.MaxButton.InnerHtml := '';
    FScrollbar.MinButton.Background.FromURL('res/btnleft.png');
    FScrollbar.MaxButton.Background.FromURL('res/btnright.png');

    invalidate;
  end;
end;

procedure TWbWindowFooter.HideScrollbar;
begin
  if FScrollbar <> nil then
  begin
    try
      FScrollbar.free;
    finally
      FScrollbar := nil;
    end;
    Invalidate();
  end;
end;

procedure TWbWindowFooter.Resize;
var
  dy: integer;
begin
  inherited;
  if FScrollbar <> nil then
  begin
    dy := (ClientHeight div 2) - 8;
    FScrollbar.SetBounds(0, dy, clientwidth, 16);
  end;
end;

//#############################################################################
// TWbExternalWindow
//#############################################################################

procedure TWbExternalWindow.OpenURL(const FullURL: string; const Options: TWbExternalWindowOptions);
begin
  if not (csDestroying in ComponentState) then
  begin
    if FFrame <> nil then
      CloseURL();

    try
      FFrame := TW3IFrameHTMLElement.Create(Content);
      FFrame.handle.style.width  := "100%";
      FFrame.handle.style.height := "100%";
      FFrame.Background.fromColor(clWhite);

      FFrame.Src := FullURL;

    finally
      FURL := FullURL;
      FOptions := Options;
    end;
  end;
end;

function TWbExternalWindow.QueryChildInThisBranch(Child: TW3TagContainer): boolean;
begin
  result := inherited QueryChildInThisBranch(Child);
  if not result then
  begin
    result := FrameHasFocus;
  end;
end;

procedure TWbExternalWindow.CloseUrl;
begin
  if FFrame <> nil then
  begin
    try
      // release the frame no matter what
      try
        FFrame.free;
      except
        // mute any exceptions
        on e: exception do;
      end;

    finally
      // Flush frame pointer & kill all content
      FFrame := nil;
      Content.InnerHTML :='';

      FURL := '';
      if not (csDestroying in ComponentState) then
      Invalidate;
    end;

  end;
end;

function TWbExternalWindow.FrameHasFocus: boolean;
begin
  result := TW3TagObj.GetDOMFocusedElement() = FFrame.Handle;
end;

//#############################################################################
// TWbWindow
//#############################################################################


procedure TWbWindow.HandleMouseDown(Sender: TObject; Button: TMouseButton;
                    Shift: TShiftState; X, Y: integer);
var
  LAccess:  IWbDesktop;
  LActive: TWbCustomWindow;
begin
  if (csDestroying in ComponentState) then
    exit;

  LAccess := GetDesktop() as IWbDesktop;
  LActive := LAccess.GetActiveWindow();

  if LActive <> nil then
  begin
    if LActive <> self then
    begin
      {$IFDEF DEBUG}
      WritelnF("[%s] Another window is set as active, changing", [{$I %FUNCTION%}]);
      {$ENDIF}
      LAccess.SetFocusedWindow(self);
      self.SetFocus();

      {$IFDEF DEBUG}
      Writeln("Calling DropFocus() on the previously active window");
      {$ENDIF}
      LActive.DropFocus();
      if LActive.Styled then
      begin
        {$IFDEF DEBUG}
        WritelnF("[%s] Other window styled as active, removing", [{$I %FUNCTION%}]);
        {$ENDIF}
        LActive.StyleAsUnFocused();
      end;

      if not Styled then
      begin
        {$IFDEF DEBUG}
        WritelnF("[%s] Applying focused styling to this window", [{$I %FUNCTION%}]);
        {$ENDIF}
        StyleAsFocused();
      end;

    end else
    begin
      {$IFDEF DEBUG}
      WritelnF("[%s] We are already set as the selected window", [{$I %FUNCTION%}]);
      {$ENDIF}
      if not Styled then
      begin
        {$IFDEF DEBUG}
        WritelnF("[%s] Styling missing somehow, applying", [{$I %FUNCTION%}]);
        {$ENDIF}
        StyleAsFocused();
      end;
    end;
  end else
  begin
    {$IFDEF DEBUG}
    WritelnF("[%s] No window set as focused, setting this one", [{$I %FUNCTION%}]);
    {$ENDIF}
    LAccess.SetFocusedWindow(self);
    SetFocus();

    if not Styled then
    begin
      {$IFDEF DEBUG}
      WritelnF("[%s] Frame not styled, applying that", [{$I %FUNCTION%}]);
      {$ENDIF}
      StyleAsFocused();
    end;
  end;

  inherited HandleMouseDown(Sender, Button, Shift, X, Y);
end;

//#############################################################################
// TWbCustomWindow
//#############################################################################

procedure TWbCustomWindow.InitializeObject;
var
  LAccess:  IWbDesktop;
  LReader:  IW3StructureReadAccess;
begin
  inherited;
  FLeft     := TWbWindowLeftSide.Create(self);
  FRight    := TWbWindowRightSide.Create(self);
  FFooter   := TWbWindowFooter.Create(self);
  FContent  := TWbWindowContent.Create(self);
  FSizer    := TWbWindowSizerGlyph.Create(self);
  FHeader   := TWbWindowHeader.Create(self);

  LAccess := GetDesktop();
  LAccess.RegisterWindow(Self);

  LReader := LAccess.GetPreferences().GetPreferencesReader();

  if LReader.ReadBool(PREFS_WINDOW_EFFECTS_OPEN) then
  begin
    fxWarpIn(0.4, procedure ()
    begin
      Setfocus();
      invalidate;
    end);
  end else
  TW3Dispatch.Execute(Invalidate, 150);
end;

procedure TWbCustomWindow.CloseWindow;
var
  LAccess:  IWbDesktop;
  LReader:  IW3StructureReadAccess;
begin
  LAccess := GetDesktop() as IWbDesktop;
  LReader := LAccess.GetPreferences().GetPreferencesReader();

  if LReader.ReadBool(PREFS_WINDOW_EFFECTS_CLOSE) then
  begin
    fxWarpOut(0.3, procedure ()
    begin
      TW3Dispatch.Execute( procedure ()
      var
        LAccess: IWbDesktop;
      begin
        LAccess := GetDesktop() as IWbDesktop;
        LAccess.SetFocusedWindow(nil);
        self.Free();
      end, 300);
    end);
  end else
  begin
    LAccess.SetFocusedWindow(nil);
    self.Free();
  end;
end;

procedure TWbCustomWindow.FinalizeObject;
begin
  FHeader.OnDblClick := NIL;
  FHeader.CloseGlyph.OnClick := NIL;
  OnMouseDown  := NIL;
  OnMouseMove  := NIL;
  OnMouseUp    := NIL;

  FContent.free;
  FFooter.free;
  FRight.free;
  FLeft.free;
  FSizer.free;
  FHeader.free;

  // Unregister with desktop
  GetDesktop().UnRegisterWindow(self);

  inherited;
end;

class function TWbCustomWindow.CreationFlags: TW3CreationFlags;
begin
  result := inherited CreationFlags();
  include(result, cfKeyCapture);
  include(result, cfAllowSelection);
end;

procedure TWbCustomWindow.SetOptions(const NewOptions: TWbWindowOptions);
begin
  FOptions := NewOptions;

  if (woSizeable in FOptions) then
  begin
    FSizer.Visible := true;
  end else
  begin
    FSizer.Visible := false;
  end;

  if (woHScroll in FOptions) then
  begin
    if FFooter.Scrollbar = nil then
      FFooter.ShowScrollbar();
  end else
  begin
    if FFooter.Scrollbar <> nil then
      FFooter.HideScrollbar();
  end;

  if (woVScroll in FOptions) then
  begin
    if FRight.Scrollbar = nil then
      FRight.ShowScrollbar();
  end else
  begin
    if FRight.Scrollbar <> nil then
      FRight.HideScrollbar();
  end;

end;

procedure TWbCustomWindow.ObjectReady;
begin
  inherited;

  FHeader.CloseGlyph.OnClick := HandleCloseClick;
  FHeader.ZOrderGlyph.OnClick := HandleZOrderClick;
  FHeader.MinimizeGlyph.OnClick := HandleMinimizeClick;

  FHeader.OnClick := procedure (sender: TObject)
  begin
    if not Topmost then
      BringToFront();
  end;

  /* Setup event handlers */
  OnMouseDown := HandleMouseDown;
  OnMouseMove := HandleMouseMove;
  OnMouseUp   := HandleMouseUp;
  OnGotFocus  := HandleGotFocus;

  FFooter.Border.Top.Style := besSolid;
  FFooter.Border.Top.Color := $92BFFF;
  FFooter.Border.Top.Width := 1;
  //FFooter.Background.FromColor(clGreen);

  FRight.Border.Left.Style := besSolid;
  FRight.Border.Left.Color := $92BFFF;
  FRight.Border.Left.Width := 1;

  FRight.Border.Right.Style := besSolid;
  FRight.Border.Right.Color := $204D8D;
  FRight.Border.Right.Width := 1;

  FLeft.Border.Left.Style := besSolid;
  FLeft.Border.Left.Color := $92BFFF;
  FLeft.Border.Left.Width := 1;

  FSizer.SetSize(20, 20);
  FSizer.Background.Size.Mode := smContain;

  FSizer.Border.Right.Style := besSolid;
  FSizer.Border.Right.Color := $204D8D;
  FSizer.Border.Right.Width := 1;

  FContent.Background.FromColor(CNT_STYLE_Background);
  FContent.Border.Bottom.Style := besSolid;
  FContent.Border.Bottom.Color := CNT_STYLE_WINDOW_FRAME_DARK;
  FContent.Border.Bottom.Width := 1;

  FContent.Border.Right.Style := besSolid;
  FContent.Border.Right.Color := CNT_STYLE_WINDOW_FRAME_DARK;
  FContent.Border.Right.Width := 1;

  FContent.Border.left.Style := besSolid;
  FContent.Border.left.Color := CNT_STYLE_WINDOW_FRAME_DARK;
  FContent.Border.left.Width := 1;

  background.fromColor(CNT_STYLE_Background);

  EdgeRadius.Top.Left := 4;
  EdgeRadius.Top.Right := 4;

  Border.Size := 1;
  border.color := CNT_STYLE_EDGE_DARKEST;
  Border.Style := besSolid;

  Handle.style['box-shadow'] := '4px 6px 5px rgba(0,0,0,0.5)';
end;

procedure TWbCustomWindow.Resize;
var
  LHeader_Height,
  LFooter_Height,
  LRight_Width,
  LSizer_Width,
  LSizer_Height,
  LLeft_Width:  integer;
begin
  inherited;

  LHeader_Height := 29;
  LFooter_Height := 4 + TInteger.EnsureRange(FFooter.GetCalculatedHeight, 0, 16);
  LRight_Width := 4 + TInteger.EnsureRange(FRight.GetCalculatedWidth, 0, 16);;
  LSizer_Width := 20;
  LSizer_Height := 20;
  LLeft_Width := 4;

  if (woSizeable in FOptions) then
  begin
    if LFooter_Height < 20 then
      LFooter_Height := 20;
  end;

  if not (csDestroying in ComponentState) then
  begin
    FHeader.SetBounds(
      0,
      0,
      ClientWidth,
      LHeader_Height);

    FContent.SetBounds(
      LLeft_Width,
      LHeader_Height,
      ClientWidth - (LRight_Width + LLeft_Width),
      ClientHeight -( LHeader_Height + LFooter_Height) );

    FLeft.SetBounds(
      0,
      LHeader_Height,
      LLeft_Width,
      ClientHeight - LHeader_Height );

    if ((woSizeable in FOptions) and FSizer.visible) then
    begin
      FRight.SetBounds(
      Clientwidth - LRight_Width,
      LHeader_Height,
      LRight_Width,
      ClientHeight - (LHeader_Height + LSizer_Height) );
    end else
    begin
      FRight.SetBounds(
      Clientwidth - LRight_Width,
      LHeader_Height,
      LRight_Width,
      ClientHeight - (LHeader_Height ) );
    end;

    FFooter.SetBounds(
      FContent.left,
      FContent.top + FContent.Height,
      FContent.width,
      LFooter_Height);

    if (woSizeable in FOptions) then
    begin
      if FSizer.visible then
      FSizer.SetBounds(
      Clientwidth - LSizer_Width,
      ClientHeight - LSizer_Height,
      LSizer_Width,
      LSizer_Height);
    end;
  end;
end;

procedure TWbCustomWindow.HandleMinimizeClick(Sender: TObject);
var
  LAccess: IWbDesktop;
  LReader: IW3StructureReadAccess;
  LHost:  TW3CustomControl;
begin
  if Parent <> nil then
  begin
    LAccess := GetDesktop() as IWbDesktop;
    LReader := LAccess.GetPreferences().GetPreferencesReader();

    LHost := TW3CustomControl(Parent);
    if BoundsRect.Compare(LHost.ClientRect) then
    begin
      if not FOldSize.Empty then
      begin
        if LReader.ReadBool(PREFS_WINDOW_EFFECTS_MIN) then
        begin
          fxScaleTo(FOldSize.left, FOldSize.top, FOldSize.width, FOldSize.height, 0.3,
            procedure ()
            begin
              Invalidate();
            end);
        end else
        SetBounds(FOldSize.left, FOldSize.top, FOldSize.width, FOldSize.height);
      end;
    end else
    begin
      FOldSize := BoundsRect;
      var LTemp := LHost.ClientRect;
      if LReader.ReadBool(PREFS_WINDOW_EFFECTS_MAX) then
      begin
        fxScaleTo(LTemp.left, LTemp.top, LTemp.width, LTemp.height, 0.3,
          procedure ()
          begin
            Invalidate();
          end);
      end else
      SetBounds(LTemp.left, LTemp.top, LTemp.width, LTemp.height);
    end;
  end;
end;

procedure TWbCustomWindow.HandleZOrderClick(Sender: TObject);
begin
  if not TopMost then
    BringToFront();
end;

procedure TWbCustomWindow.HandleCloseClick(Sender: TObject);
begin
  TW3Dispatch.Execute(CloseWindow, 100);
end;

procedure TWbCustomWindow.StyleAsFocused;
begin
  try
    Content.EnableInput();
    FHeader.TagStyle.Add("TWbWindowHeader_focused");
    FHeader.ZOrderGlyph.TagStyle.Add("TWbWindowZOrderGlyph_focused");
    FHeader.MinimizeGlyph.TagStyle.Add("TWbWindowMinimizeGlyph_focused");
    FHeader.CloseGlyph.TagStyle.Add("TWbWindowCloseGlyph_focused");
    FSizer.TagStyle.Add("TWbWindowSizerGlyph_focused");
    Background.fromColor(CNT_STYLE_WINDOW_BASE_SELECTED);
  finally
    FStyled := true;
  end;
end;

procedure TWbCustomWindow.StyleAsUnFocused;
begin
  try
    Content.DisableInput(false);
    FHeader.TagStyle.RemoveByName("TWbWindowHeader_focused");
    FHeader.ZOrderGlyph.TagStyle.RemoveByName("TWbWindowZOrderGlyph_focused");
    FHeader.MinimizeGlyph.TagStyle.RemoveByName("TWbWindowMinimizeGlyph_focused");
    FHeader.CloseGlyph.TagStyle.RemoveByName("TWbWindowCloseGlyph_focused");
    FSizer.TagStyle.RemoveByName("TWbWindowSizerGlyph_focused");
    Background.fromColor(CNT_STYLE_WINDOW_BASE_UNSELECTED);
  finally
    FStyled := false;
  end;
end;

procedure TWbCustomWindow.UnSelect;
begin
  // Remove styling by brute force. Actually quicker :/
  var LAccess := GetDesktop();
  LAccess.SetFocusedWindow(nil);

  var LList := LAccess.GetWindowList();
  if LList.count > 0 then
  begin
    for var x:=low(LList) to high(LList) do
    begin
      var LItem := LList[x];
      if LItem.Styled then
        LItem.StyleAsUnFocused();
    end;
  end;
end;

procedure TWbCustomWindow.HandleGotFocus(Sender: TObject);
begin
  {$IFDEF DEBUG}
  writelnF("[%s] GotFocus event catched",[{$I %FUNCTION%}]);
  {$ENDIF}
  var LAccess := GetDesktop();
  LAccess.SetFocusedWindow(self);
  StyleAsFocused();

  // Remove styling by brute force. Actually quicker :/
  var LList := LAccess.GetWindowList();
  if LList.count > 0 then
  begin
    for var x:=low(LList) to high(LList) do
    begin
      var LItem := LList[x];
      if LItem <> self then
      begin
        if LItem.Styled then
          LItem.StyleAsUnFocused();
      end;
    end;
  end;
end;

procedure TWbCustomWindow.HandleMouseDown(Sender: TObject; Button: TMouseButton;
                    Shift: TShiftState; X, Y: integer);
begin
  if (csDestroying in ComponentState) then
    exit;

  if Button = TMouseButton.mbLeft then
  begin
    if FHeader.BoundsRect.ContainsPos(x,y) then
    begin
      /* Dont override glyph's natural behavior */
      if FHeader.ZOrderGlyph.BoundsRect.ContainsPos(x, y)
      or FHeader.MinimizeGlyph.BoundsRect.ContainsPos(x, y)
      or FHeader.CloseGlyph.BoundsRect.ContainsPos(x, y) then
      exit;

      SetFocus();
      SetCapture();
      FContent.DisableInput(false);
      FMoveActive := true;
      FStartPos := TPoint.Create(x, y);

    end else

    if FSizer.BoundsRect.ContainsPos(x,y) then
    begin
      SetFocus();
      SetCapture();
      FContent.DisableInput(false);
      FStartPos := TPoint.Create(x, y);
      FSizeActive := true;
    end;
  end;
end;

procedure TWbCustomWindow.HandleMouseMove(Sender: TObject;
          Shift: TShiftState; X, Y: integer);
var
  dx, dy : integer;
  wd, hd: integer;
begin
  if (csDestroying in ComponentState) then
    exit;

  if FMoveActive then
  begin
    dx := left + (x - FStartPos.x);
    dy := top + (y - FStartPos.y);
    MoveTo(dx, dy);
  end else

  if FSizeActive then
  begin
    wd := width + (x - FStartPos.x);
    hd := height + (y - FStartPos.y);
    SetSize(wd,hd);
    FStartPos.x := x;
    FStartPos.y := y;
  end;
end;

procedure TWbCustomWindow.HandleMouseUp(Sender: TObject; Button: TMouseButton;
          Shift: TShiftState; X, Y: integer);
begin
  if (csDestroying in ComponentState) then
    exit;

  if FMoveActive then
  begin
    FMoveActive := false;
    ReleaseCapture();
    FContent.EnableInput();
  end else

  if FSizeActive then
  begin
    FSizeActive := false;
    ReleaseCapture();
    FContent.EnableInput();
  end;
end;

//#############################################################################
// TWbWindowContent
//#############################################################################

procedure TWbWindowContent.FinalizeObject;
begin
  if InputDisabled then
    FBlocker.free;
  inherited;
end;

procedure TWbWindowContent.Resize;
begin
  inherited;
  if FBlocker <> nil then
    FBlocker.SetBounds(0, 0, clientwidth, clientheight);
end;

function TWbWindowContent.InputDisabled: boolean;
begin
  result := FBlocker <> nil;
end;

procedure TWbWindowContent.DisableInput(Const BlockPermanent: boolean);
begin
  if not InputDisabled then
  begin
    BeginUpdate;
    try
      FPermanent := BlockPermanent;

      FBlocker := TW3WindowFocusBlock.Create(self);
      FBlocker.Handle.ReadyExecute( procedure ()
        begin
          FBlocker.Background.fromColor(clblue);
          FBlocker.AlphaBlend := true;
          FBlocker.Opacity := 3;
        end);


      if not BlockPermanent then
      begin
        FOldSelect := GetContentSelectionMode();
        SetContentSelectionMode(tsmNone);
      end else
      SetContentSelectionMode(tsmNone);
    finally
      EndUpdate;
      Invalidate;

      // Fire event
      if assigned(OnInputDisabled) then
      OnInputDisabled(self);
    end;
  end;
end;

procedure TWbWindowContent.EnableInput;
begin
  if InputDisabled then
  begin
    if not FPermanent then
    begin
      BeginUpdate;
      try
        FBlocker.free;
        FBlocker := nil;
        SetContentSelectionMode(FOldSelect);
      finally
        EndUpdate;
        Invalidate();

        // Fire event
        if assigned(OnInputEnabled) then
        OnInputEnabled(self);
      end;
    end;
  end;
end;


//#############################################################################
// TWbWindowHeader
//#############################################################################

procedure TWbWindowHeader.InitializeObject;
begin
  inherited;
  FClose := TWbWindowCloseGlyph.Create(self);
  FZOrder:= TWbWindowZOrderGlyph.Create(self);
  FMinimize := TWbWindowMinimizeGlyph.Create(self);
  FTitle := TW3Label.Create(self);
end;

procedure TWbWindowHeader.FinalizeObject;
begin
  FTitle.free;
  FClose.free;
  FZOrder.free;
  FMinimize.free;
  inherited;
end;

procedure TWbWindowHeader.ObjectReady;
begin
  inherited;
  FClose.width := 24;
  FZOrder.width := 28;
  FMinimize.Width := 23;

  FTitle.TextShadow.Shadow(1, 1, 0, clBlack);
  FTitle.OnChanged := HandleTitleChanged;

  Border.Bottom.Width:= 1;
  Border.Bottom.Color:= CNT_STYLE_EDGE_DARKEST;
  Border.Bottom.Style:= besSolid;
end;

procedure TWbWindowHeader.HandleTitleChanged(Sender: TObject);
begin
  TW3Dispatch.Execute(Invalidate, 100);
end;

procedure TWbWindowHeader.Resize;
var
  dx: integer;
  wd: integer;
  xd: integer;
begin
  inherited;
  xd := 23;

  FClose.SetBounds(0, 0, xd, ClientHeight);
  dx := FClose.width + 2;

  wd := Clientwidth;
  dec(wd, FClose.width + 2);
  dec(wd, FMinimize.width);
  dec(wd, FZOrder.width);
  FTitle.SetBounds(dx, 0, wd, ClientHeight);

  dx := clientwidth - FZOrder.width;
  FZOrder.SetBounds(dx, 0, FZOrder.width, ClientHeight);

  dx := FZOrder.left - FMinimize.width;
  FMinimize.SetBounds(dx,0,FMinimize.width,ClientHeight);
end;

end.

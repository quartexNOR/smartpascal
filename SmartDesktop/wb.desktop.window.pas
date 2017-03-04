unit wb.desktop.window;

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
  wb.desktop.iconView,

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
  end;

  TWbWindowFooter = class(TWbWindowElement)
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
  end;

  TWbWindowMoveBeginsEvent  = TNotifyEvent;
  TWbWindowMoveEndsEvent    = TNotifyEvent;
  TWbWindowSizeBeginsEvent  = TNotifyEvent;
  TWbWindowSizeEndsEvent    = TNotifyEvent;

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
    FOldSize:     TRect; // Size of window before maximize
    FStyled:      boolean;
  protected
    procedure HandleCloseClick(Sender: TObject); virtual;
    procedure HandleZOrderClick(Sender: TObject); virtual;
    procedure HandleMinimizeClick(Sender: TObject); virtual;
    procedure HandleGotFocus(Sender: TObject); virtual;
    procedure HandleLostFocus(Sender: TObject); virtual;
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

    procedure PatchChildControls; virtual;

    class function CreationFlags: TW3CreationFlags; override;

    procedure CloseWindow;
  published
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
var
  LHandle:  TControlHandle;
  LAccess:  IWbDesktop;
begin
  LHandle := FFrame.Handle;
  result := GetDOMFocusedElement = LHandle;
  (* asm
    @result = (document.activeElement == @LHandle);
  end; *)
  result := TW3TagObj.GetDOMFocusedElement() = LHandle;
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
  LPrefs:   TW3Structure;
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

  LPrefs := LAccess.GetPreferencesObject();
  if LPrefs <> nil then
  begin
    if LPrefs.ReadBool(PREFS_WINDOW_EFFECTS_OPEN) then
    begin
      self.fxWarpIn(0.4, procedure ()
      begin
        Setfocus();
        invalidate;
      end);
    end;
  end;
end;

procedure TWbCustomWindow.CloseWindow;
var
  LAccess:  IWbDesktop;
  LPrefs:   TW3Structure;
begin
  if not (csDestroying in ComponentState) then
  begin
    LAccess := GetDesktop() as IWbDesktop;
    LPrefs := LAccess.GetPreferencesObject();
    if LPrefs.ReadBool(PREFS_WINDOW_EFFECTS_CLOSE) then
    begin
      self.fxWarpOut(0.3, procedure ()
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

procedure TWbCustomWindow.ObjectReady;
begin
  inherited;
  FHeader.CloseGlyph.OnClick := HandleCloseClick;
  FHeader.ZOrderGlyph.OnClick := HandleZOrderClick;
  FHeader.MinimizeGlyph.OnClick := HandleMinimizeClick;

  /* Setup event handlers */
  OnMouseDown := HandleMouseDown;
  OnMouseMove := HandleMouseMove;
  OnMouseUp   := HandleMouseUp;
  OnGotFocus  := HandleGotFocus;
  OnLostFocus := HandleLostFocus;

  FFooter.Border.Top.Style := besSolid;
  FFooter.Border.Top.Color := $92BFFF;; //CNT_STYLE_WINDOW_FRAME_DARK;
  FFooter.Border.Top.Width := 1;

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

  background.fromColor(CNT_STYLE_Background); //CNT_STYLE_WINDOW_BASE_UNSELECTED

  EdgeRadius.Top.Left := 4;
  EdgeRadius.Top.Right := 4;

  Border.Size := 1;
  border.color := CNT_STYLE_EDGE_DARKEST;
  Border.Style := besSolid;

  Handle.style['box-shadow'] := '4px 6px 5px rgba(0,0,0,0.5)';
end;

procedure TWbCustomWindow.Resize;
const
  CNT_HEADER_HEIGHT = 29;
  CNT_FOOTER_HEIGHT = 20;
  CNT_RIGHT_WIDTH   = 20;
  CNT_SIZER_WIDTH   = 20;
  CNT_SIZER_HEIGHT  = 20;
  CNT_LEFT_WIDTH    = 8;
begin
  inherited;
  if not (csDestroying in ComponentState) then
  begin
    FHeader.SetBounds(
      0,
      0,
      ClientWidth,
      CNT_HEADER_HEIGHT);

    FContent.SetBounds(
      CNT_LEFT_WIDTH,
      CNT_HEADER_HEIGHT,
      ClientWidth - (CNT_RIGHT_WIDTH + CNT_LEFT_WIDTH),
      ClientHeight -( CNT_HEADER_HEIGHT + CNT_FOOTER_HEIGHT) );

    FLeft.SetBounds(
      0,
      CNT_HEADER_HEIGHT,
      CNT_LEFT_WIDTH,
      ClientHeight - CNT_HEADER_HEIGHT );

    FRight.SetBounds(
      Clientwidth - CNT_RIGHT_WIDTH,
      CNT_HEADER_HEIGHT,
      CNT_RIGHT_WIDTH,
      ClientHeight - (CNT_HEADER_HEIGHT + CNT_SIZER_HEIGHT) );

    FFooter.SetBounds(
      FContent.left,
      FContent.top + FContent.Height,
      FContent.width,
      CNT_FOOTER_HEIGHT);

    FSizer.SetBounds(
      Clientwidth - CNT_SIZER_WIDTH,
      ClientHeight - CNT_SIZER_HEIGHT,
      CNT_SIZER_WIDTH,
      CNT_SIZER_HEIGHT);
  end;
end;

procedure TWbCustomWindow.HandleMinimizeClick(Sender: TObject);
var
  LAccess: IWbDesktop;
  LPrefs: TW3Structure;
  LHost:  TW3CustomControl;
begin
  if Parent <> nil then
  begin
    LAccess := GetDesktop() as IWbDesktop;
    LPrefs := LAccess.GetPreferencesObject();
    LHost := TW3CustomControl(Parent);

    if BoundsRect.Compare(LHost.ClientRect) then
    begin
      if not FOldSize.Empty then
      begin
        if LPrefs.ReadBool(PREFS_WINDOW_EFFECTS_MIN) then
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

        if LPrefs.ReadBool(PREFS_WINDOW_EFFECTS_MAX) then
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

procedure TWbCustomWindow.PatchChildControls;
begin
end;

procedure TWbCustomWindow.StyleAsFocused;
begin
  Content.EnableInput();
  FHeader.TagStyle.Add("TWbWindowHeader_focused");
  FHeader.ZOrderGlyph.TagStyle.Add("TWbWindowZOrderGlyph_focused");
  FHeader.MinimizeGlyph.TagStyle.Add("TWbWindowMinimizeGlyph_focused");
  FHeader.CloseGlyph.TagStyle.Add("TWbWindowCloseGlyph_focused");
  FSizer.TagStyle.Add("TWbWindowSizerGlyph_focused");
  Background.fromColor(CNT_STYLE_WINDOW_BASE_SELECTED);
  FStyled := true;
end;

procedure TWbCustomWindow.StyleAsUnFocused;
begin
  Content.DisableInput(false);
  FHeader.TagStyle.RemoveByName("TWbWindowHeader_focused");
  FHeader.ZOrderGlyph.TagStyle.RemoveByName("TWbWindowZOrderGlyph_focused");
  FHeader.MinimizeGlyph.TagStyle.RemoveByName("TWbWindowMinimizeGlyph_focused");
  FHeader.CloseGlyph.TagStyle.RemoveByName("TWbWindowCloseGlyph_focused");
  FSizer.TagStyle.RemoveByName("TWbWindowSizerGlyph_focused");
  Background.fromColor(CNT_STYLE_WINDOW_BASE_UNSELECTED);
  FStyled := false;
end;

procedure TWbCustomWindow.HandleGotFocus(Sender: TObject);
begin
  {$IFDEF DEBUG}
  writelnF("[%s] GotFocus event catched",[{$I %FUNCTION%}]);
  {$ENDIF}
  var LAccess := GetDesktop();
  LAccess.SetFocusedWindow(self);
  StyleAsFocused();
end;

procedure TWbCustomWindow.HandleLostFocus(Sender: TObject);
begin
  if not (csDestroying in ComponentState) then
  begin

    TW3Dispatch.Execute( procedure ()
    var
      LAccess:  IWbDesktop;
      LActive:  TWbCustomWindow;
      LTemp: TW3TagContainer;
    begin
      LAccess := GetDesktop() as IWbDesktop;

      LTemp := TW3TagContainer( TW3ControlTracker.GetFocusedControl() );
      if LTemp <> nil then
      begin

        if QueryChildInThisBranch(LTemp) then
        begin
          {$IFDEF DEBUG}
          WritelnF("[%s] A child was clicked that belongs to this window's branch", ["HandleLostFocus"]);
          {$ENDIF}

          LActive := LAccess.GetActiveWindow();
          if LActive <> self then
          begin
            if LActive <> nil then
            {$IFDEF DEBUG}
            WritelnF("[%s] Another window had focus, informing manager that we should still have focus", ["HandleLostFocus"]) else
            {$ENDIF}
            begin
              {$IFDEF DEBUG}
              writelnF("[%s] Eh, ok im exiting", ["HandleLostFocus"]);
              WritelnF("[%s] Styling window as un-focused", ["HandleLostFocus"]);
              {$ENDIF}
              StyleAsUnFocused();
              exit;
            end;
            LAccess.SetFocusedWindow(self);
          end;

          if FStyled then
          begin
            {$IFDEF DEBUG}
            WritelnF("[%s] Aborting de-styling of window", ["HandleLostFocus"]);
            {$ENDIF}
            exit;
          end;
        end else
        begin
          {$IFDEF DEBUG}
          WritelnF("[%s] A child was clicked but does not register to this window's branch?", ["HandleLostFocus"]);
          {$ENDIF}
          var qParent := LTemp.GetRootControlFor(LTemp);
          //if qParent <> nil then
          //writeln("Parent =" + qParent.ClassName);

          if qParent = self then
          begin
            {$IFDEF DEBUG}
            WritelnF("[%s] Odd, we can trace it back to us", ["HandleLostFocus"]);
            {$ENDIF}
            LAccess.SetFocusedWindow(self);
            exit;
          end

          else
            begin
              writeln("DAMN! ->" + LTemp.classname);
            end

          {$IFDEF DEBUG}
          else
          begin
            WritelnF("[%s] Could not be found in our branch, so allowing blur()", ["HandleLostFocus"]);
          end
          {$ENDIF}
          ;
        end;
      end;

      {$IFDEF DEBUG}
      WritelnF("[%s] Styling window as un-focused", ["HandleLostFocus"]);
      {$ENDIF}
      StyleAsUnFocused();
    end, 30);

  end;
end;

procedure TWbCustomWindow.HandleMouseDown(Sender: TObject; Button: TMouseButton;
                    Shift: TShiftState; X, Y: integer);
var
  LAccess:  IWbDesktop;
  LActive: TWbCustomWindow;
begin
  if (csDestroying in ComponentState) then
    exit;

  (* LAccess := GetDesktop() as IWbDesktop;
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

      if not FStyled then
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
      if not FStyled then
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
  end;    *)

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
          FBlocker.Opacity := 10;
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
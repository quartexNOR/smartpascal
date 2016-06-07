unit qtxheader;

//#############################################################################
//
//  Unit:       qtxheader.pas
//  Author:     Jon Lennart Aasenden [Cipher Diaz of Quartex]
//  Company:    Jon Lennart Aasenden LTD
//  Copyright:  Copyright Jon Lennart Aasenden, all rights reserved
//
//  About:      This unit introduces a replacement for TW3HeaderControl.
//              It uses CSS3 animation effects to slide and fade header
//              elements out of view, which makes for a more responsive
//              and living UI experience.
//
//
//  _______           _______  _______ _________ _______
// (  ___  )|\     /|(  ___  )(  ____ )\__   __/(  ____ \|\     /|
// | (   ) || )   ( || (   ) || (    )|   ) (   | (    \/( \   / )
// | |   | || |   | || (___) || (____)|   | |   | (__     \ (_) /
// | |   | || |   | ||  ___  ||     __)   | |   |  __)     ) _ (
// | | /\| || |   | || (   ) || (\ (      | |   | (       / ( ) \
// | (_\ \ || (___) || )   ( || ) \ \__   | |   | (____/\( /   \ )
// (____\/_)(_______)|/     \||/   \__/   )_(   (_______/|/     \|
//
//
//
//#############################################################################


interface

uses 
  System.Types, SmartCL.System, SmartCL.Components, SmartCL.Effects,
  SmartCL.controls.toolbutton, SmartCL.graphics, SmartCL.borders,
  w3c.dom,
  qtxutils,
  qtxeffects,
  qtxlabel;

{$DEFINE USE_ANIMFRAME_SYNC}


const
CNT_ANIM_DELAY  = 0.22;

type

  TQTXButtonVisibleEvent = Procedure (sender:TObject;aVisible:Boolean);

  (* Isolate commonalities for Back/Next buttons in ancestor class *)
  TQTXHeaderButton = Class(TW3ToolButton)
  private
    FOnVisible: TQTXButtonVisibleEvent;
  public
    property  OnVisibleChange:TQTXButtonVisibleEvent
              read FOnVisible write FOnVisible;
  Protected
    Procedure setInheritedVisible(const aValue:Boolean);
  End;

  (* Back-button, slides to the left out of view *)
  TQTXBackButton = Class(TQTXHeaderButton)
  protected
    procedure setVisible(const aValue:Boolean);reintroduce;
  published
    Property  Visible:Boolean read getVisible write setVisible;
  End;

  (* Next-button, slides to the right out of view *)
  TQTXNextButton = Class(TQTXHeaderButton)
  protected
    procedure setVisible(const aValue:Boolean);reintroduce;
  published
    Property  Visible:Boolean read getVisible write setVisible;
  End;

  (* Header title label, uses fx to change text *)
  TQTXHeaderTitle = Class(TQTXLabel)
  private
    Procedure SetInheritedCaption(const aValue:String);
  protected
    procedure setCaption(const aValue:String);override;
  End;


  (* Header control, dynamically resizes and positions caption and
     button based on visibility. Otherwise identical to TW3HeaderControl *)
  TQTXHeaderBar = Class(TW3CustomControl)
  private
    FBackButton:  TQTXBackButton;
    FNextButton:  TQTXNextButton;
    FCaption:     TQTXHeaderTitle;
    FMargin:  Integer = 4;
    FFader:   Boolean = false;

    Procedure HandleBackButtonVisibleChange(sender:TObject;aVisible:Boolean);
    Procedure HandleNextButtonVisibleChange(sender:TObject;aVisible:Boolean);
  protected
    Procedure setMargin(const aValue:Integer);
    Procedure Resize;override;
    Procedure InitializeObject;override;
    Procedure FinalizeObject;Override;
  public
    Property  FadeTitle:Boolean read FFader write FFader;
    Property  Margin:Integer read FMargin write setMargin;
    Property  Title:TQTXHeaderTitle read FCaption;
    Property  BackButton:TQTXBackButton read FBackButton;
    property  NextButton:TQTXNextButton read FNextButton;
  End;

implementation

//#############################################################################
// TQTXHeaderButton
//#############################################################################

(* This method simply exposes access to the inherited version of
   setVisible. Since inherited method cannot be called from
   anonymous event-handlers, we expose it here. *)
Procedure TQTXHeaderButton.setInheritedVisible(const aValue:Boolean);
Begin
  inherited setVisible(aValue);
end;

//#############################################################################
// TQTXBackButton
//#############################################################################


procedure TQTXBackButton.setVisible(const aValue:Boolean);
var
  mParent:  TQTXHeaderBar;
  dx: Integer;
Begin
  (* Make sure object is ready and that the
     button is injected into the DOM *)
  if  ObjectReady
  and Handle.Ready
  and TQTXRuntime.Ready then
  Begin
    (* Make sure parent is valid *)
    if Parent<>NIL then
    Begin
      (* get parent by ref *)
      mParent:=TQTXHeaderBar(Parent);

      if aValue<>getVisible then
      begin

        case aValue of
        false:
          Begin
            if mParent.ObjectReady
            and mParent.Handle.Ready then
            Begin

              dx:=-Width;

              {$IFDEF USE_ANIMFRAME_SYNC}
              w3_requestAnimationFrame( procedure ()
              begin
              {$ENDIF}
                self.fxMoveTo(dx,top,CNT_ANIM_DELAY,
                procedure ()
                begin
                  setInheritedVisible(false);
                end);
              {$IFDEF USE_ANIMFRAME_SYNC}
              end);
              {$ENDIF}

            end else
            setInheritedVisible(false);
          end;
        True:
          Begin
            setInheritedVisible(true);
            self.MoveTo(-Width,
             (mParent.ClientHeight div 2) - self.height div 2);

            if mParent.ObjectReady
            and mParent.Handle.Ready then
            {$IFDEF USE_ANIMFRAME_SYNC}
            w3_requestAnimationFrame( procedure ()
            {$ENDIF}
            Begin
              self.fxMoveTo(mParent.margin,
              (mParent.ClientHeight div 2) - self.height div 2,CNT_ANIM_DELAY);
            {$IFDEF USE_ANIMFRAME_SYNC}
            end);
            {$ELSE}
            end;
            {$ENDIF}
          end;
        end;

        if assigned(OnVisibleChange)
        and mParent.Handle.Ready then
        OnVisibleChange(self,aValue);
      end;
    end;
  end else
  inherited setVisible(aValue);
end;

//#############################################################################
// TQTXNextButton
//#############################################################################

procedure TQTXNextButton.setVisible(const aValue:Boolean);
var
  dy: Integer;
  dx: Integer;
  mParent:  TQTXHeaderBar;
Begin
  (* Make sure element is ready and inserted into the DOM *)
  if  ObjectReady
  and TQTXRuntime.Ready
  and Handle.Ready then
  Begin
    (* make sure parent is valid *)
    if parent<>NIL then
    begin
      (* Make sure this represents a change in state *)
      if aValue<>getVisible then
      Begin
        (* cast parent to local variable *)
        mParent:=TQTXHeaderBar(Parent);

        case aValue of
        false:
          begin
            (* move button out to the right *)
            dy:=top;
            dx:=mParent.Width;

            {$IFDEF USE_ANIMFRAME_SYNC}
            w3_requestAnimationFrame( procedure ()
            begin
            {$ENDIF}
              self.fxMoveTo(dx,dy,CNT_ANIM_DELAY,
              procedure ()
              begin
                setInheritedVisible(false);
              end);
            {$IFDEF USE_ANIMFRAME_SYNC}
            end);
            {$ENDIF}
          end;

        true:
          begin
            (* move button in to the left *)
            setInheritedVisible(true);
            dy:=top;
            dx:=(mParent.ClientWidth - mparent.margin) - self.Width;

            {$IFDEF USE_ANIMFRAME_SYNC}
            w3_requestAnimationFrame( procedure ()
            begin
            {$ENDIF}
              self.fxMoveTo(dx,dy,CNT_ANIM_DELAY);
            {$IFDEF USE_ANIMFRAME_SYNC}
            end);
            {$ENDIF}
          end;
        end;

        if assigned(OnVisibleChange) then
        OnVisibleChange(self,aValue);
      end;
    end;
  end else
  inherited setVisible(aValue);
end;

//#############################################################################
// TQTXHeaderTitle
//#############################################################################

Procedure TQTXHeaderTitle.SetInheritedCaption(const aValue:String);
Begin
  inherited setCaption(aValue);
end;

Procedure TQTXHeaderTitle.setCaption(const aValue:String);
begin
  (* Make sure we can do this *)
  if  ObjectReady
  and TQTXRuntime.Ready
  and Handle.Ready then
  Begin
    (* Check valid parent *)
    if Parent<>NIL then
    Begin
      (* Use fading at all? *)
      if TQTXHeaderBar(Parent).FadeTitle then
      Begin
        {$IFDEF USE_ANIMFRAME_SYNC}
        w3_requestAnimationFrame( procedure ()
        begin
        {$ENDIF}
          self.fxFadeOut(CNT_ANIM_DELAY,
            procedure ()
            Begin
              setInheritedCaption(aValue);
              self.fxFadeIn(CNT_ANIM_DELAY);
            end);
        {$IFDEF USE_ANIMFRAME_SYNC}
        end);
        {$ENDIF}
      end else
      setInheritedCaption(aValue);
    end else
    inherited setCaption(aValue);
  end else
  inherited setCaption(aValue);
end;

//#############################################################################
// TQTXHeaderBar
//#############################################################################

Procedure TQTXHeaderBar.InitializeObject;
Begin
  inherited;

  StyleClass:='TW3HeaderControl';

  FBackButton:=TQTXBackButton.Create(self);
  FBackButton.setInheritedVisible(false);
  FBackbutton.styleClass:='TW3ToolButton';
  FBackbutton.Caption:='Back';
  FBackbutton.Height:=28;

  FNextButton:=TQTXNextButton.Create(self);
  FNextButton.setInheritedVisible(false);
  FNextButton.styleClass:='TW3ToolButton';
  FNextButton.Caption:='Next';
  FNextButton.height:=28;

  FCaption:=TQTXHeaderTitle.Create(self);
  FCaption.Autosize:=False;
  FCaption.Caption:='Welcome';
  FCaption.handle.style['border']:='1px solid #444444';
  FCaption.handle.style['background-color']:='rgba(255,255,255,0.2)';

  (* hook up events when element is injected in the DOM *)
  //TQTXTools.ExecuteOnElementReady(Handle, procedure ()
  Handle.ReadyExecute( procedure ()
    Begin
      (* Use update mechanism, which forces an internal
         resize when sized flag is set *)
      beginUpdate;
      try
        FBackButton.OnVisibleChange:=HandleBackButtonVisibleChange;
        FNextButton.OnVisibleChange:=HandleNextButtonVisibleChange;
        setWasMoved;
        setWasSized;
      finally
        EndUpdate;
      end;
    end);
end;

Procedure TQTXHeaderBar.FinalizeObject;
Begin
  FBackbutton.free;
  FNextButton.free;
  FCaption.free;
  inherited;
end;

Procedure TQTXHeaderBar.setMargin(const aValue:Integer);
Begin
  if aValue<>FMargin then
  begin
    (* If the element is not ready, try again
       in 100 ms *)
    if  ObjectReady
    and TQTXRuntime.Ready
    and Handle.Ready then
    Begin
      BeginUpdate;
      FMargin:=TInteger.EnsureRange(aValue,1,MAX_INT);
      setWasSized;
      endUpdate;
    end else
    TQTXRuntime.DelayedDispatch( procedure ()
      begin
        setMargin(aValue);
      end,100);
  end;
end;

Procedure TQTXHeaderBar.HandleNextButtonVisibleChange
          (sender:TObject;aVisible:Boolean);
var
  wd,dx:  Integer;
Begin
  case aVisible of
  false:
    begin
      wd:=clientwidth;
      dec(wd,FMargin);
      if FBackButton.Visible then
      dec(wd,FBackButton.width + FMargin);

      dx:=FMargin;
      if FBackButton.visible then
      inc(dx,FBackButton.Width + FMargin);

      if ObjectReady
      and Handle.Ready then
      Begin
        wd:=wd - FMargin;

        {$IFDEF USE_ANIMFRAME_SYNC}
        w3_requestAnimationFrame( procedure ()
        begin
        {$ENDIF}
          FCaption.fxScaleTo(dx,
            (clientHeight div 2) - FCaption.Height div 2,
            wd,
            FCaption.height,
            CNT_ANIM_DELAY,
            NIL);
        {$IFDEF USE_ANIMFRAME_SYNC}
        end);
        {$ENDIF}
      end;

    end;
  true:
    Begin

      dx:=FMargin;
      if FBackButton.visible then
      inc(dx,FBackButton.Width + FMargin);

      wd:=ClientWidth - (2 * FMargin);
      if FBackButton.Visible then
      dec(wd,FBackButton.width);
      dec(wd,FNextButton.Width);

      dec(wd,FMargin * 2);

      {$IFDEF USE_ANIMFRAME_SYNC}
      w3_requestAnimationFrame( procedure ()
      begin
      {$ENDIF}
        FCaption.fxSizeTo(wd,FCaption.Height,CNT_ANIM_DELAY,
        procedure ()
        Begin
          FCaption.fxMoveTo(dx,
          (clientHeight div 2) - FCaption.Height div 2, CNT_ANIM_DELAY);
        end);
      {$IFDEF USE_ANIMFRAME_SYNC}
      end);
      {$ENDIF}

    end;
  end;
  Resize;
end;

Procedure TQTXHeaderBar.HandleBackButtonVisibleChange
          (sender:TObject;aVisible:Boolean);
var
  dx: Integer;
  wd: Integer;
Begin

  case aVisible of
  false:
    begin
      {$IFDEF USE_ANIMFRAME_SYNC}
      w3_requestAnimationFrame( procedure ()
      begin
      {$ENDIF}
        FBackButton.fxMoveTo(-FBackButton.width,
          (clientheight div 2) - FBackButton.height div 2,
          CNT_ANIM_DELAY);
      {$IFDEF USE_ANIMFRAME_SYNC}
      end);
      {$ENDIF}
    end;
  true:
    Begin
      {$IFDEF USE_ANIMFRAME_SYNC}
      w3_requestAnimationFrame( procedure ()
      begin
      {$ENDIF}
        FBackButton.fxMoveTo(FMargin,
          (clientheight div 2) - FBackButton.height div 2,
          CNT_ANIM_DELAY);
      {$IFDEF USE_ANIMFRAME_SYNC}
      end);
      {$ENDIF}
    end;
  end;

  case aVisible of
  false:
    Begin
      wd:=ClientWidth - (FMargin * 2);

      if FNextButton.Visible then
      Begin
        dec(wd,FNextButton.Width);
        dec(wd,FMargin);
      end;

      {$IFDEF USE_ANIMFRAME_SYNC}
      w3_requestAnimationFrame( procedure ()
      begin
      {$ENDIF}
        FCaption.fxScaleTo(Fmargin,
        (clientHeight div 2) - (FCaption.height div 2),
        wd,FCaption.Height,CNT_ANIM_DELAY,NIL);
      {$IFDEF USE_ANIMFRAME_SYNC}
      end);
      {$ENDIF}
    end;
  true:
    Begin
      dx:=FMargin + BackButton.Width + FMargin;

      wd:=ClientWidth - (FMargin * 2);
      dec(wd,FBackButton.width);

      if FNextButton.visible then
      Begin
        dec(wd,FNextButton.Width);
        dec(wd,FMargin * 2);
      end else
      dec(wd,FMargin);

      {$IFDEF USE_ANIMFRAME_SYNC}
      w3_requestAnimationFrame( procedure ()
      begin
      {$ENDIF}
        FCaption.fxScaleTo(dx,
          (clientHeight div 2) - (FCaption.height div 2),
          wd,FCaption.Height,
          CNT_ANIM_DELAY,
          NIL);
      {$IFDEF USE_ANIMFRAME_SYNC}
      end);
      {$ENDIF}
    end;
  end;
end;

Procedure TQTXHeaderBar.Resize;
var
  dx: Integer;
  wd: Integer;
Begin
  inherited;
  if FBackbutton.visible then
  FBackbutton.setbounds(FMargin,
    (clientheight div 2) - FBackButton.height div 2,
    FBackButton.width,
    FBackbutton.height);

  if FNextButton.visible then
  FNextButton.setBounds((clientwidth-FMargin)-FNextButton.width,
    (clientHeight div 2) - FNextButton.height div 2,
    FNextButton.width,
    FNextButton.Height);

  dx:=FMargin;
  if FBackButton.visible then
  inc(dx,FBackButton.Width + FMargin);

  wd:=ClientWidth - FMargin;
  if FBackButton.visible then
  dec(wd,FBackButton.Width + FMargin);

  if FNextButton.visible then
  begin
    dec(wd,FNextButton.width + FMargin);
    dec(wd,FMargin);
  end else
  dec(wd,FMargin);

  FCaption.SetBounds(dx,
     (clientHeight div 2) - (FCaption.height div 2),
     wd,FCaption.Height);
end;

end.

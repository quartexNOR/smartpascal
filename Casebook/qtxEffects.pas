unit qtxEffects;

{$DEFINE USE_ANIM_HELPER}
{.$DEFINE USE_ANIM_REGISTRY}

//#############################################################################
//
//  Unit:       qtxEffects.pas
//  Author:     Jon Lennart Aasenden
//  Company:    Jon Lennart Aasenden LTD
//  Copyright:  Copyright Jon Lennart Aasenden, all rights reserved
//
//  About:      This unit introduces a class helper for TW3CustomControl
//              which provides jQuery like "effects", such as fadeIn/out etc.
//
//  Note:       Simply add this unit to your uses-list, and all controls
//              based on TW3CustomControl will have the new methods.
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
(* Note:

   This unit can use a dictionary-object for keeping track of active
   animations. This is essentially not required for just executing X
   number of animations on an element (component), but if you want
   to stop or pause an animation presently running - then this is
   the way to do it.

   So if you enable "USE_ANIM_REGISTRY" above, you can use the function
   GetEffectObj() to get the TW3CustomAnimation object active
   for the current element, e.g:

   var mAnim:TW3CustomAnimation := GetEffectObj(self.handle);

   I should also note that the laws of css animations are pure-evil:
     "Once an animation is started, it cannot be paused or stopped
      until it reaches an end-point"

   An "end-point" being a step in the animation, or - as is the case for
   animations that goes from X1 to X2, that it has to run entirely until
   the end until it responds. I suspect animations run in their own thread
   inside the webkit/moz engine, hence the "careful" API.

   So animations are notoriously hard to work with.

   This is exactly why libraries like Tween.js is used more and more
   in games and multimedia, because it deploys an update mechanism which
   you control. As opposed to the hardware accellerated, shoot
   and forget nature of CSS3 animations.

   Having said that, animations are great for giving otherwise static
   forms some "life", for moving buttons and elements around in response
   to user-influence -- so when used well they can really be a great
   bonus to your apps.

   *)

interface

uses 
  System.Types, SmartCL.System, SmartCL.Components, SmartCL.Effects,
  w3c.dom,
  qtxutils;

const
CNT_RELEASE_DELAY = 25;
CNT_CACHE_DELAY   = 50;

type


  TQTXMoveAnimation = class(TW3TransitionAnimation)
  private
    FFromX: Integer;
    FFromY: Integer;
    FToX:   Integer;
    FToY:   Integer;
  protected
    function KeyFramesCSS: String; override;
  public
    Property  FromX:Integer read FFromX write FFromX;
    Property  FromY:Integer read FFromY write FFromY;
    Property  ToX:Integer read FToX write FToX;
    Property  ToY:Integer read FToY write FToY;
  end;

  TQTXFadeAnimation = Class(TW3TransitionAnimation)
  private
    FFrom:    Float;
    FTo:      Float;
  protected
    function KeyFramesCSS: String; override;
  public
    Property  FromOpacity:Float read FFrom write FFrom;
    property  ToOpacity:Float read FTo write FTo;
  End;

  TQTXSizeAnimation = Class(TW3TransitionAnimation)
  private
    FFromWidth:   Integer;
    FFromHeight:  Integer;
    FToWidth:     Integer;
    FToHeight:    Integer;
    FFromX:       Integer;
    FFromY:       Integer;
    FToX:         Integer;
    FToY:         Integer;
  protected
    function KeyFramesCSS: String; override;
  public
    Property  fromLeft:Integer read FFromX write FFromX;
    Property  fromTop:Integer read FFromY write FFromY;
    Property  fromWidth:Integer read FFromWidth write FFromWidth;
    property  fromHeight:Integer read FFromHeight write FFromHeight;
    Property  toWidth:Integer read FToWidth write FToWidth;
    Property  toHeight:Integer read FToHeight write FToHeight;
    Property  toLeft:Integer read FToX write FToX;
    property  toTop:Integer read FToY write FToY;
  End;

  TQTXEffectsHelper = Class helper for TW3CustomControl

    function  fxFadeOut(const Duration:Float):TW3CustomControl;overload;
    Procedure fxFadeOut(const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxFadeIn(const Duration:Float):TW3CustomControl;
    Procedure fxFadeIn(const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxWarpOut(const Duration:Float):TW3CustomControl;overload;
    Procedure fxWarpOut(const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxWarpIn(const Duration:Float):TW3CustomControl;overload;
    procedure fxWarpIn(const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxZoomIn(const Duration:Float):TW3CustomControl;overload;
    Procedure fxZoomIn(const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxZoomOut(const Duration:Float):TW3CustomControl;overload;
    Procedure fxZoomOut(const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxScaleTo(const aToX,aToY,aToWidth,aToHeight:Integer;
              const Duration:Float):TW3CustomControl;overload;
    Procedure fxScaleTo(const aToX,aToY,aToWidth,aToHeight:Integer;
              const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxMoveTo(const dx,dy:Integer;
              const Duration:Float):TW3CustomControl;overload;
    Procedure fxMoveTo(const dx,dy:Integer;
              const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxMoveBy(const dx,dy:Integer;
              const Duration:Float):TW3CustomControl;overload;
    Procedure fxMoveBy(const dx,dy:Integer;
              const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxMoveUp(const Duration:Float):TW3CustomControl;overload;
    Procedure fxMoveUp(const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxMoveDown(const Duration:Float):TW3CustomControl;overload;
    procedure fxMoveDown(const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxSizeTo(const aWidth,aHeight:Integer;
              const Duration:Float):TW3CustomControl;overload;
    Procedure fxSizeTo(const aWidth,aHeight:Integer;
              const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function fxScaleDown(aFactor:Integer;
              const Duration:Float):TW3CustomControl;overload;
    procedure fxScaleDown(aFactor:Integer;const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxScaleUp(aFactor:Integer;
              const Duration:Float):TW3CustomControl;overload;
    Procedure fxScaleUp(aFactor:Integer;const Duration:Float;
              const OnFinished:TProcedureRef);overload;

    function  fxBusy:Boolean;
    Procedure fxSetBusy(const aValue:Boolean);
  End;

  {$IFDEF USE_ANIM_HELPER}
  TQTXAnimationHelper = helper for TW3CustomAnimation
    procedure Pause;
    procedure Resume;
    procedure Stop;
  End;
  {$ENDIF}

{$IFDEF USE_ANIM_REGISTRY}
Procedure RegisterActiveEffect(const aElement:THandle;const aEffect:TW3CustomAnimation);
Procedure UnRegisterEffect(const aElement:THandle);
function GetEffectObj(const aElement:THandle):TW3CustomAnimation;
{$ENDIF}

implementation

{$IFDEF USE_ANIM_REGISTRY}
uses w3Dictionaries;
{$ENDIF}

{$IFDEF USE_ANIM_REGISTRY}
var
_FActive: TW3ObjDictionary;

Initialization
begin
  _FActive:=TW3ObjDictionary.Create;
end;

Finalization
begin
  if assigned(_FActive) then
  _FActive.free;
end;

Procedure RegisterActiveEffect(const aElement:THandle;const aEffect:TW3CustomAnimation);
var
  mRef: String;
begin
  mRef:=IntToStr(aElement);
  _FActive.values[mRef]:=aEffect;
end;

Procedure UnRegisterEffect(const aElement:THandle);
var
  mRef: String;
begin
  mRef:=IntToStr(aElement);
  _FActive.delete(mRef);
end;

function GetEffectObj(const aElement:THandle):TW3CustomAnimation;
var
  mRef: String;
begin
  mRef:=IntToStr(aElement);
  result:=TW3CustomAnimation(_FActive.Values[mRef]);
end;
{$ENDIF}

//############################################################################
//
//############################################################################


Procedure BeforeEffect(const aControl:TW3CustomControl;
          const aEffectObj:TW3CustomAnimation);
Begin
  aControl.fxSetBusy(True);
  {$IFDEF USE_ANIM_REGISTRY}
  RegisterActiveEffect(aControl.handle,aEffectObj);
  {$ENDIF}
end;

Procedure AfterEffect(const aControl:TW3CustomControl;
          const aEffectObj:TW3CustomAnimation);
begin
  aControl.fxSetBusy(False);
  {$IFDEF USE_ANIM_REGISTRY}
  UnRegisterEffect(aControl.handle);
  {$ENDIF}
end;

//############################################################################
// TQTXAnimationHelper
//############################################################################

{$IFDEF USE_ANIM_HELPER}
procedure TQTXAnimationHelper.Pause;
begin
  if self.Active then
  self.target.handle.style[w3_CSSPrefix('AnimationPlayState')]:='paused';
end;

procedure TQTXAnimationHelper.Resume;
var
  mRef: THandle;
  mId:  String;
Begin
  if self.active then
  begin
    mId:=w3_CSSPrefix('AnimationPlayState');
    mRef:=self.target.handle;
    if (mRef.style[mID]) then
    if mRef.style[mId]<>'running' then
    mRef.style[mId]:='running';
  end;
end;

procedure TQTXAnimationHelper.Stop;
begin
  if self.active then
  self.target.handle.style[w3_CSSPrefix('AnimationPlayState')]:='stopped';
end;
{$ENDIF}

//############################################################################
// TQTXFadeAnimation
//############################################################################

function TQTXFadeAnimation.KeyFramesCSS: String;
begin
  result:= "
    0% { opacity: " + FFrom.toString + "; }
    100% { opacity: " + FTo.toString + "; }";
end;

//############################################################################
// TQTXMoveAnimation
//############################################################################

function TQTXSizeAnimation.KeyFramesCSS: String;
Begin
   Result := Format(#"
      from {
        left: %dpx;
        top:  %dpx;
        width: %dpx;
        height: %dpx;
      } to {
        left: %dpx;
        top:  %dpx;
        width: %dpx;
        height: %dpx;
   }",[ fFromX,fFromY,fFromWidth,fFromHeight,
        fToX,fToY,fToWidth,fToHeight]);
end;

//############################################################################
// TQTXMoveAnimation
//############################################################################

function TQTXMoveAnimation.KeyFramesCSS: String;
Begin
   Result := Format(#"
      from {
        left: %dpx;
        top:  %dpx;
      } to {
        left: %dpx;
        top: %dpx;
   }",[FFromX,FFromY,FToX,FToY]);
end;

//############################################################################
// TQTXEffectsHelper
//############################################################################

function TQTXEffectsHelper.fxBusy:Boolean;
Begin
  if self.elementData.exists('fxBusy') then
  result:=self.ElementData.read('fxBusy')='yes';
  self.elementData.write('fxBusy','no');
end;

Procedure TQTXEffectsHelper.fxSetBusy(const aValue:Boolean);
Begin
  self.elementdata.write('fxBusy','yes');
end;

function TQTXEffectsHelper.fxScaleUp(aFactor:Integer;
          const Duration:Float):TW3CustomControl;
Begin
  fxScaleUp(aFactor,Duration,NIL);
  result:=self;
end;

Procedure TQTXEffectsHelper.fxScaleUp(aFactor:Integer;const Duration:Float;
              const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  begin
    mEffect:=TQTXSizeAnimation.Create;
    mEffect.duration:=Duration;

    aFactor:=TInteger.ensureRange(aFactor,1,MAX_INT);

    TQTXSizeAnimation(mEffect).fromLeft:=self.Left;
    TQTXSizeAnimation(mEffect).fromTop:=self.top;
    TQTXSizeAnimation(mEffect).fromWidth:=self.width;
    TQTXSizeAnimation(mEffect).fromHeight:=self.Height;

    TQTXSizeAnimation(mEffect).toLeft:=self.left-aFactor;
    TQTXSizeAnimation(mEffect).toTop:=self.top-aFactor;
    TQTXSizeAnimation(mEffect).toWidth:=self.width + (aFactor*2);
    TQTXSizeAnimation(mEffect).toHeight:=self.height + (aFactor*2);

    TQTXSizeAnimation(mEffect).Timing:=atEaseInOut;
    mEffect.onAnimationEnds:=Procedure (sender:TObject)
      Begin

        setbounds(TQTXSizeAnimation(mEffect).toLeft,
          TQTXSizeAnimation(mEffect).toTop,
          TQTXSizeAnimation(mEffect).toWidth,
          TQTXSizeAnimation(mEffect).toHeight);

        TQTXRuntime.DelayedDispatch( procedure ()
        Begin
          (* Release effect object *)
          TW3CustomAnimation(sender).free;

          (* register effect done *)
          AfterEffect(self,TW3CustomAnimation(sender));

          if assigned(OnFinished) then
          OnFinished();

        end, CNT_RELEASE_DELAY);
      end;

    (* Register effect begins *)
    BeforeEffect(self,mEffect);

    (* Execute effect *)
    mEffect.execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxScaleUp(afactor,duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;

function TQTXEffectsHelper.fxScaleDown(aFactor:Integer;
          const Duration:Float):TW3CustomControl;
Begin
  fxScaleDown(aFactor,Duration,NIL);
  result:=self;
end;

procedure TQTXEffectsHelper.fxScaleDown(aFactor:Integer;const Duration:Float;
          const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  Begin
    mEffect:=TQTXSizeAnimation.Create;
    mEffect.duration:=Duration;

    TQTXSizeAnimation(mEffect).fromLeft:=self.Left;
    TQTXSizeAnimation(mEffect).fromTop:=self.top;
    TQTXSizeAnimation(mEffect).fromWidth:=self.width;
    TQTXSizeAnimation(mEffect).fromHeight:=self.Height;

    aFactor:=TInteger.ensureRange(aFactor,1,MAX_INT);
    TQTXSizeAnimation(mEffect).toLeft:=self.left+aFactor;
    TQTXSizeAnimation(mEffect).toTop:=self.top+aFactor;
    TQTXSizeAnimation(mEffect).toWidth:=self.width - (aFactor*2);
    TQTXSizeAnimation(mEffect).toHeight:=self.height - (aFactor*2);

    TQTXSizeAnimation(mEffect).Timing:=atEaseInOut;
    mEffect.onAnimationEnds:=Procedure (sender:TObject)
      Begin
        setbounds(TQTXSizeAnimation(mEffect).toLeft,
          TQTXSizeAnimation(mEffect).toTop,
          TQTXSizeAnimation(mEffect).toWidth,
          TQTXSizeAnimation(mEffect).toHeight);
        TQTXRuntime.DelayedDispatch( procedure ()
        Begin
          (* Release effect object *)
          TW3CustomAnimation(sender).free;

          (* register effect done *)
          AfterEffect(self,TW3CustomAnimation(sender));

          if assigned(OnFinished) then
          OnFinished();

        end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    mEffect.execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxScaleDown(aFactor,duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;

function TQTXEffectsHelper.fxSizeTo(const aWidth,aHeight:Integer;
          const Duration:Float):TW3CustomControl;
Begin
  fxSizeTo(aWidth,aHeight,Duration,NIL);
  result:=self;
end;

Procedure TQTXEffectsHelper.fxSizeTo(const aWidth,aHeight:Integer;
          const Duration:Float;
          const OnFinished:TProcedureRef);
Begin
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  Begin
    mEffect:=TQTXSizeAnimation.Create;
    mEffect.duration:=Duration;

    TQTXSizeAnimation(mEffect).fromLeft:=self.Left;
    TQTXSizeAnimation(mEffect).fromTop:=self.top;
    TQTXSizeAnimation(mEffect).fromWidth:=self.width;
    TQTXSizeAnimation(mEffect).fromHeight:=self.Height;

    TQTXSizeAnimation(mEffect).toLeft:=self.left;
    TQTXSizeAnimation(mEffect).toTop:=self.top;
    TQTXSizeAnimation(mEffect).toWidth:=aWidth;
    TQTXSizeAnimation(mEffect).toHeight:=aHeight;

    TQTXSizeAnimation(mEffect).Timing:=atEaseInOut;
    mEffect.onAnimationEnds:=Procedure (sender:TObject)
      Begin
        setbounds(TQTXSizeAnimation(mEffect).toLeft,
          TQTXSizeAnimation(mEffect).toTop,
          TQTXSizeAnimation(mEffect).toWidth,
          TQTXSizeAnimation(mEffect).toHeight);
        TQTXRuntime.DelayedDispatch( procedure ()
        Begin
          (* Release effect object *)
          TW3CustomAnimation(sender).free;

          (* register effect done *)
          AfterEffect(self,TW3CustomAnimation(sender));

          if assigned(OnFinished) then
          OnFinished();

        end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    mEffect.execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxSizeTo(aWidth,aHeight,duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
  end;
end;

function TQTXEffectsHelper.fxMoveUp(const Duration:Float):TW3CustomControl;
begin
  fxMoveUp(Duration,NIL);
  result:=self;
end;

Procedure TQTXEffectsHelper.fxMoveUp(const Duration:Float;
          const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  begin
    mEffect:=TQTXMoveAnimation.Create;
    mEffect.duration:=Duration;
    TQTXMoveAnimation(mEffect).fromX:=self.left;
    TQTXMoveAnimation(mEffect).fromY:=self.top;
    TQTXMoveAnimation(mEffect).toX:=self.left;
    TQTXMoveAnimation(mEffect).toY:=0;
    TQTXMoveAnimation(mEffect).Timing:=atEaseInOut;
    mEffect.onAnimationEnds:=Procedure (sender:TObject)
      Begin
        self.top:=0;
        TQTXRuntime.DelayedDispatch( procedure ()
        Begin
          (* Release effect object *)
          TW3CustomAnimation(sender).free;

          (* register effect done *)
          AfterEffect(self,TW3CustomAnimation(sender));

          if assigned(OnFinished) then
          OnFinished;

        end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    mEffect.execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxMoveUp(duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;

procedure TQTXEffectsHelper.fxMoveDown(const Duration:Float;
          const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  Begin
    mEffect:=TQTXMoveAnimation.Create;
    mEffect.duration:=Duration;
    TQTXMoveAnimation(mEffect).fromX:=self.left;
    TQTXMoveAnimation(mEffect).fromY:=self.top;
    TQTXMoveAnimation(mEffect).toX:=self.left;
    TQTXMoveAnimation(mEffect).toY:=TW3MovableControl(self.Parent).Height-Self.Height;
    TQTXMoveAnimation(mEffect).Timing:=atEaseInOut;
    mEffect.onAnimationEnds:=Procedure (sender:TObject)
      Begin
        self.top:=TW3MovableControl(self.Parent).Height-Self.Height;;
        TQTXRuntime.DelayedDispatch( procedure ()
        Begin
            (* Release effect object *)
            TW3CustomAnimation(sender).free;

            (* register effect done *)
            AfterEffect(self,TW3CustomAnimation(sender));

            if assigned(OnFinished) then
            OnFinished();
        end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    mEffect.execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxMoveDown(duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;

function TQTXEffectsHelper.fxMoveDown(const Duration:Float):TW3CustomControl;
Begin
  fxMoveDown(Duration,NIL);
  result:=self;
end;

function TQTXEffectsHelper.fxMoveBy(const dx,dy:Integer;
              const Duration:Float):TW3CustomControl;
Begin
  fxMoveBy(dx,dy,Duration,NIL);
  result:=self;
end;

Procedure TQTXEffectsHelper.fxMoveBy(const dx,dy:Integer;
          const Duration:Float;
          const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  begin
    mEffect:=TQTXMoveAnimation.Create;
    mEffect.duration:=Duration;
    TQTXMoveAnimation(mEffect).fromX:=self.left;
    TQTXMoveAnimation(mEffect).fromY:=self.top;
    TQTXMoveAnimation(mEffect).toX:=self.left + dx;
    TQTXMoveAnimation(mEffect).toY:=self.top + dy;
    TQTXMoveAnimation(mEffect).Timing:=atEaseInOut;
    mEffect.onAnimationEnds:=Procedure (sender:TObject)
      Begin
        self.left:=dx;
        self.top:=dy;
        TQTXRuntime.DelayedDispatch( procedure ()
        Begin
          (* Release effect object *)
          TW3CustomAnimation(sender).free;

          (* register effect done *)
          AfterEffect(self,TW3CustomAnimation(sender));

          (* signal callback if valid *)
          if assigned(OnFinished) then
          OnFinished();
        end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    mEffect.execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxMoveBy(dx,dy,duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;

function TQTXEffectsHelper.fxScaleTo(const aToX,aToY,aToWidth,aToHeight:Integer;
          const Duration:Float):TW3CustomControl;
Begin
  fxScaleTo(aToX,aToY,aToWidth,aToHeight,Duration,NIL);
  result:=self;
end;

Procedure TQTXEffectsHelper.fxScaleTo(const aToX,aToY,aToWidth,aToHeight:Integer;
          const Duration:Float;
          const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  begin
    mEffect:=TQTXSizeAnimation.Create;
    mEffect.duration:=Duration;
    TQTXSizeAnimation(mEffect).fromLeft:=self.left;
    TQTXSizeAnimation(mEffect).fromTop:=self.top;
    TQTXSizeAnimation(mEffect).fromWidth:=self.Width;
    TQTXSizeAnimation(mEffect).fromHeight:=self.Height;

    TQTXSizeAnimation(mEffect).toLeft:=aToX;
    TQTXSizeAnimation(mEffect).toTop:=aToY;
    TQTXSizeAnimation(mEffect).toWidth:=aToWidth;
    TQTXSizeAnimation(mEffect).toHeight:=aToHeight;

    TQTXSizeAnimation(mEffect).Timing:=atEaseInOut;
    mEffect.onAnimationEnds:=Procedure (sender:TObject)
      Begin
        self.setBounds(aToX,aToY,aToWidth,aToHeight);
        TQTXRuntime.DelayedDispatch( procedure ()
        Begin
          (* Release effect object *)
          TW3CustomAnimation(sender).free;

          (* register effect done *)
          AfterEffect(self,TW3CustomAnimation(sender));

          (* signal callback if valid *)
          if assigned(OnFinished) then
          OnFinished();
        end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    mEffect.execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxScaleTo(aToX,aToY,aToWidth,aToHeight,duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;

function TQTXEffectsHelper.fxMoveTo(const dx,dy:Integer;
         const Duration:Float):TW3CustomControl;
Begin
  fxMoveTo(dx,dy,Duration,NIL);
  result:=self;
end;

Procedure TQTXEffectsHelper.fxMoveTo(const dx,dy:Integer;
          const Duration:Float;
          const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  begin
    mEffect:=TQTXMoveAnimation.Create;
    mEffect.duration:=Duration;
    TQTXMoveAnimation(mEffect).fromX:=self.left;
    TQTXMoveAnimation(mEffect).fromY:=self.top;
    TQTXMoveAnimation(mEffect).toX:=dx;
    TQTXMoveAnimation(mEffect).toY:=dy;

    TQTXMoveAnimation(mEffect).Timing:=atLinear;
    mEffect.onAnimationEnds:=Procedure (sender:TObject)
      Begin
        self.left:=dx;
        self.top:=dy;
        TQTXRuntime.DelayedDispatch( procedure ()
        Begin
          (* Release effect object *)
          TW3CustomAnimation(sender).free;

          (* register effect done *)
          AfterEffect(self,TW3CustomAnimation(sender));

          (* signal callback if valid *)
          if assigned(OnFinished) then
          OnFinished();
        end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    mEffect.execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxMoveTo(dx,dy,duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;

function TQTXEffectsHelper.fxZoomIn(const Duration:Float):TW3CustomControl;
Begin
  fxZoomIn(Duration,NIL);
  result:=self;
end;

Procedure TQTXEffectsHelper.fxZoomIn(const Duration:Float;
          const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  Begin
    mEffect:=TW3ZoomInTransition.Create;
    mEffect.Duration:=Duration;
    mEffect.OnAnimationEnds:=Procedure (Sender:TObject)
      Begin
      TQTXRuntime.DelayedDispatch( procedure ()
          Begin
            (* Release effect object *)
            TW3CustomAnimation(sender).free;

            (* register effect done *)
            AfterEffect(self,TW3CustomAnimation(sender));

            (* signal callback if valid *)
            if assigned(OnFinished) then
            OnFinished();
          end, CNT_RELEASE_DELAY);
      end;
    self.Visible:=true;
    BeforeEffect(self,mEffect);
    mEffect.Execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxZoomIn(duration,OnFinished);
    end,
    100);
end;

function TQTXEffectsHelper.fxZoomOut(const Duration:Float):TW3CustomControl;
Begin
  fxZoomOut(Duration,NIL);
  result:=self;
end;

Procedure TQTXEffectsHelper.fxZoomOut(const Duration:Float;
          const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  Begin
    mEffect:=TW3ZoomOutTransition.Create;
    mEffect.Duration:=Duration;
    mEffect.OnAnimationEnds:=Procedure (Sender:TObject)
      Begin
        self.Visible:=false;
        TQTXRuntime.DelayedDispatch( procedure ()
          Begin
            (* Release effect object *)
            TW3CustomAnimation(sender).free;

            (* register effect done *)
            AfterEffect(self,TW3CustomAnimation(sender));

            (* signal callback if valid *)
            if assigned(OnFinished) then
            OnFinished();
          end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    mEffect.Execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxZoomOut(duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;

function TQTXEffectsHelper.fxWarpOut(const Duration:Float):TW3CustomControl;
begin
  fxWarpOut(Duration,NIL);
  result:=NIL;
end;

Procedure TQTXEffectsHelper.fxWarpOut(const Duration:Float;
              const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  begin
    mEffect:=TW3WarpOutTransition.Create;
    mEffect.Duration:=Duration;
    mEffect.OnAnimationEnds:=Procedure (Sender:TObject)
      Begin
        self.Visible:=false;
        TQTXRuntime.DelayedDispatch( procedure ()
          Begin
            (* Release effect object *)
            TW3CustomAnimation(sender).free;

            (* register effect done *)
            AfterEffect(self,TW3CustomAnimation(sender));

            (* signal callback if valid *)
            if assigned(OnFinished) then
            OnFinished();
          end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    mEffect.Execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxWarpOut(duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;

function TQTXEffectsHelper.fxWarpIn(const Duration:Float):TW3CustomControl;
Begin
  fxWarpIn(Duration,NIL);
  result:=self;
end;

procedure TQTXEffectsHelper.fxWarpIn(const Duration:Float;
          const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  Begin
    mEffect:=TW3WarpInTransition.Create;
    mEffect.Duration:=Duration;
    mEffect.OnAnimationEnds:=Procedure (Sender:TObject)
      Begin
        TQTXRuntime.DelayedDispatch( procedure ()
          Begin
            (* Release effect object *)
            TW3CustomAnimation(sender).free;

            (* register effect done *)
            AfterEffect(self,TW3CustomAnimation(sender));

            (* signal callback if valid *)
            if assigned(OnFinished) then
            OnFinished();
          end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    self.Visible:=true;
    mEffect.Execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxWarpIn(duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;

function TQTXEffectsHelper.fxFadeIn(const Duration:Float):TW3CustomControl;
Begin
  fxFadeIn(Duration,NIL);
  result:=Self;
end;

Procedure TQTXEffectsHelper.fxFadeIn(const Duration:Float;
          const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  begin
    mEffect:=TQTXFadeAnimation.Create;

    TQTXFadeAnimation(mEffect).fromOpacity:=0.0;
    TQTXFadeAnimation(mEffect).toOpacity:=1.0;
    mEffect.Duration:=Duration;
    mEffect.OnAnimationEnds:=Procedure (Sender:TObject)
      Begin
        TQTXRuntime.DelayedDispatch( procedure ()
          Begin
            (* Release effect object *)
            TW3CustomAnimation(sender).free;

            (* register effect done *)
            AfterEffect(self,TW3CustomAnimation(sender));

            (* signal callback if valid *)
            if assigned(OnFinished) then
            OnFinished();
          end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    self.Visible:=true;
    mEffect.Execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxFadeIn(duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;

function TQTXEffectsHelper.fxFadeOut(const Duration:Float):TW3CustomControl;
Begin
  fxFadeOut(Duration,NIL);
  result:=self;
end;

Procedure TQTXEffectsHelper.fxFadeOut(const Duration:Float;
          const OnFinished:TProcedureRef);
var
  mEffect: TW3CustomAnimation;
Begin
  if not fxBusy then
  begin
    mEffect:=TQTXFadeAnimation.Create;
    TQTXFadeAnimation(mEffect).fromOpacity:=1.0;
    TQTXFadeAnimation(mEffect).toOpacity:=0.0;
    mEffect.Duration:=Duration;
    mEffect.OnAnimationEnds:=Procedure (Sender:TObject)
      Begin
        self.Visible:=False;
        TQTXRuntime.DelayedDispatch( procedure ()
          Begin
            (* Release effect object *)
            TW3CustomAnimation(sender).free;

            (* register effect done *)
            AfterEffect(self,TW3CustomAnimation(sender));

            (* signal callback if valid *)
            if assigned(OnFinished) then
            OnFinished();
          end, CNT_RELEASE_DELAY);
      end;
    BeforeEffect(self,mEffect);
    mEffect.Execute(self);
  end else
  TQTXRuntime.DelayedDispatch( procedure ()
    Begin
      fxFadeOut(duration,OnFinished);
    end,
    CNT_CACHE_DELAY);
end;



end.

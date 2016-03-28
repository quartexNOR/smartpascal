unit system.animation.effects;

interface

uses 
  SmartCL.System, SmartCL.Graphics, SmartCL.Components, SmartCL.Forms,
  SmartCL.Fonts, SmartCL.Borders, SmartCL.Application,
  System.Types,
  System.Colors,
  system.animation.tween;

type

  TEffectOptions = set of (eoCancelOnExecute);

  EEffectError = class(EW3Exception);

  TCustomEffect = class(TObject)
  private
    FOptions: TEffectOptions;
  protected
    procedure DoSetOptions(const Value:TEffectOptions);virtual;
    procedure DoExecute;virtual;abstract;
    procedure DoCancel;virtual;abstract;
    procedure DoPause;virtual;abstract;
    procedure DoResume;virtual;abstract;
    function  DoGetActive:Boolean;virtual;abstract;
  public
    property  Options:TEffectOptions read FOptions write DoSetOptions;
    property  OnEffectStarted:TNotifyEvent;
    property  OnEffectDone:TNotifyEvent;
    property  OnEffectPaused:TNotifyEvent;
    property  OnEffectCanceled:TNotifyEvent;

    Property  Duration:Float;

    Property  Active:Boolean read DoGetActive;
    procedure Execute(const OnReady:TNotifyEvent);virtual;
    procedure Cancel;virtual;
    procedure Pause;virtual;
    procedure Resume;virtual;
  end;

  TCustomTweenEffect = class(TCustomEffect)
  private
    FTween:     TTween;
  protected
    procedure   DoExecute;override;
    procedure   DoCancel;override;
    procedure   DoPause;override;
    procedure   DoResume;override;
    function    DoGetActive:Boolean;override;
  protected
    procedure   DoSetupTween;virtual;
    procedure   DoTearDownTween;virtual;
  protected
    procedure   HandleTweenDone(sender:TObject);virtual;
    procedure   HandleTweenStart(sender:TObject);virtual;
    procedure   HandleTweenUpdated(Sender:TObject);virtual;
  public
    Property    Busy:Boolean read ( FTween.active );

    Property    TweenEngine:TTween read FTween;

    procedure   Execute(const OnReady:TNotifyEvent);override;
    procedure   Cancel;override;
    procedure   Pause;override;
    procedure   Resume;override;

    Property    Distance:float;
    property    Easing: TTweenEasingType;
    Property    Behavior: TTweenBehavior;

    Constructor Create;virtual;
    Destructor  Destroy;Override;
  end;

  TCustomControlEffect = class(TCustomTweenEffect)
  private
    FControl:   TW3MovableControl;
  public
    Property    Control:TW3MovableControl read FControl;
    Constructor Create(aControl: TW3MovableControl);overload;virtual;
  end;

  TMoveXEffect = class(TCustomControlEffect)
  protected
    procedure   DoSetupTween;override;
    procedure   DoTearDownTween;override;
  public
    Property    FromX: Integer;
  end;

  TMoveYEffect = class(TCustomControlEffect)
  protected
    procedure   DoSetupTween;override;
    procedure   DoTearDownTween;override;
  public
    Property    FromY: Integer;
    Property    Distance:Integer;
  end;

  TColorMorphEffect = class(TCustomControlEffect)
  protected
    procedure   DoSetupTween;override;
    procedure   DoTearDownTween;override;
    procedure   HandleTweenDone(sender:TObject);override;
  public
    property    FromColor:TColor;
    property    ToColor:TColor;
  end;

  TCSSBinding = class(TObject)
  private
    procedure   HandleElementUpdated(const Sender:TTweenElement);
  public
    property    Effect:TCustomControlEffect;
    property    Tween:TTweenElement;
    function    Translate(value:float):variant;virtual;abstract;
    constructor Create(const aEffect:TCustomControlEffect;const aTween:TTweenElement);
  end;

  TCSSBindingPixels = class(TCSSBinding)
  protected
    function Translate(value:float):variant;override;
  end;

  TCSSBindingString = class(TCSSBinding)
  protected
    function Translate(value:float):variant;override;
  end;

  TCSSBindingInteger = class(TCSSBinding)
  protected
    function Translate(value:float):variant;override;
  end;

  TCSSBindingFloat = class(TCSSBinding)
  protected
    function Translate(value:float):variant;override;
  end;

  TCSSBindingEvent = procedure (sender:TCSSBinding;value:float;var output:variant);

  TCSSBindingOwner = class(TCSSBinding)
  protected
    function Translate(value:float):variant;override;
  published
    property  OnTranslate:TCSSBindingEvent;
  end;

  TCSSBindingType = (sbPixels, sbString, sbInteger, sbFloat, sbOwner);

  TWidgetEffect = class(TCustomControlEffect)
  private
    FBindings:  Array of TCSSBinding;
  protected
    procedure DoSetupTween;override;
  public
    function  Bind(CSSPropertyName:String;const Translation:TCSSBindingType):TCSSBinding;overload;
    function  Bind(CSSPropertyName:String;const TranslationProc:TCSSBindingEvent):TCSSBinding;overload;
  end;

implementation


procedure TWidgetEffect.DoSetupTween;
begin
  (*
var
  LObj: TTweenElement;
begin
  TweenEngine.OnUpdated := NIL;

  LObj := TweenEngine.Add("xpos");

  LObj.StartValue := FromX;
  LObj.Distance := Distance ;
  LObj.Duration := Duration;
  LObj.AnimationType := Easing;
  LObj.Behavior := Behavior;
  LObj.OnUpdated := procedure (const Sender:TTweenElement)
    begin
      Control.Left := round ( Sender.Value );
    end;
  *)

  for var x:=0 to self.TweenEngine.Count-1 do
  begin
    TweenEngine.Item[x].Duration := self.Duration;
    TweenEngine.Item[x].Distance := self.Distance;
    TweenEngine.Item[x].Behavior := self.Behavior;
    TweenEngine.Item[x].StartValue := 0.0;
    TweenEngine.Item[x].StartTime:= now;
  end;

end;

function TWidgetEffect.Bind(CSSPropertyName:String;
         const TranslationProc:TCSSBindingEvent):TCSSBinding;
begin
  result := bind(CSSPropertyName,sbOwner);
  TCSSBindingOwner(result).OnTranslate := TranslationProc;
end;

function TWidgetEffect.Bind(CSSPropertyName:String;
         const Translation:TCSSBindingType):TCSSBinding;
var
  Ltween: TTweenElement;
begin
  // setup a tween element
  LTween := TweenEngine.Add(CSSPropertyName);
  LTween.Duration := self.Duration;
  LTWeen.Distance := self.Distance;
  LTween.Behavior := self.Behavior;
  LTween.StartValue := 0.0;
  //LTween.StartTime:= now;

  // create the translation object
  case Translation of
  sbPixels:   result := TCSSBindingPixels.Create(self,LTween);
  sbString:   result := TCSSBindingString.Create(self,LTween);
  sbInteger:  result := TCSSBindingInteger.Create(self,LTween);
  sbFloat:    result := TCSSBindingFloat.Create(self,LTween);
  sbOwner:    result := TCSSBindingOwner.Create(self,LTween);
  end;

  // store reference to translator in tween object
  LTween.TagObject := result;

  LTween.OnUpdated:=procedure (const sender:TTweenElement)
    begin
      // call css-binding to translate the value
      var value := TCSSBinding(sender.TagObject).Translate(sender.Value);

      writeln(Value);

      // set CSS style by name
      control.Handle.style[sender.Id] := value;
    end;

  FBindings.add(result);
end;

//#############################################################################
// TColorMorphEffect
//#############################################################################

procedure TColorMorphEffect.DoSetupTween;
begin
  var LObj := TweenEngine.add("clr");
  LObj.Distance:=100;
  LObj.StartValue :=0;
  LObj.StartTime := now;
  LObj.Easing := Easing;
  LObj.Duration := Duration;
  LObj.OnUpdated := procedure (const Element:TTweenElement)
    var
      target: TColor;
    begin
      target := TW3RGBA.Blend(ToColor, FromColor, trunc(LObj.Value));
      Control.Background.FromColor(target);
    end;
end;

procedure TColorMorphEffect.HandleTweenDone(sender:TObject);
begin
  Control.Background.FromColor(ToColor);
  inherited HandleTweenDone(sender);
end;

procedure TColorMorphEffect.DoTearDownTween;
begin
  TweenEngine.Delete("clr");
end;

//#############################################################################
// TCSSBindingPixels
//#############################################################################

function TCSSBindingPixels.Translate(value:float):variant;
begin
  result := round(value).ToString() + 'px';
end;

//#############################################################################
// TCSSBindingString
//#############################################################################

function TCSSBindingString.Translate(value:float):variant;
begin
  result := FloatToStr(value);
end;

//#############################################################################
// TCSSBindingInteger
//#############################################################################

function TCSSBindingInteger.Translate(value:float):variant;
begin
  result := round(value);
end;

//#############################################################################
// TCSSBindingFloat
//#############################################################################

function TCSSBindingFloat.Translate(value:float):variant;
begin
  result := value;
end;

//#############################################################################
// TCSSBindingOwner
//#############################################################################

function TCSSBindingOwner.Translate(value:float):variant;
begin
  if assigned(OnTranslate) then
  begin
    OnTranslate(self,value,result);
  end else
  result := value;
end;

//#############################################################################
// TCSSBinding
//#############################################################################

Constructor TCSSBinding.Create(const aEffect:TCustomControlEffect;
            const aTween:TTweenElement);
begin
  inherited Create;
  Effect := aEffect;
  Tween := aTween;
  Tween.OnUpdated := HandleElementUpdated;
end;

procedure TCSSBinding.HandleElementUpdated(const Sender:TTweenElement);
begin
  w3_setStyle(Effect.Control.Handle,sender.id,sender.value);
end;

//#############################################################################
// TMoveYEffect
//#############################################################################

procedure TMoveYEffect.DoSetupTween;
var
  LObj: TTweenElement;
begin
  TweenEngine.OnUpdated := NIL;

  LObj := TweenEngine.Add("ypos");
  LObj.StartValue := FromY;
  LObj.Distance := Distance ;
  LObj.Duration := Duration;
  LObj.Easing := ttCubeIn;
  LObj.Behavior := tbSingle;
  LObj.OnUpdated := procedure (const Sender:TTweenElement)
    begin
      Control.Top := round ( Sender.Value );
    end;
end;

procedure TMoveYEffect.DoTearDownTween;
begin
  TweenEngine.Delete("ypos");
end;

//#############################################################################
// TMoveXEffect
//#############################################################################

procedure TMoveXEffect.DoSetupTween;
var
  LObj: TTweenElement;
begin
  TweenEngine.OnUpdated := NIL;

  LObj := TweenEngine.Add("xpos");

  LObj.StartValue := FromX;
  LObj.Distance := Distance ;
  LObj.Duration := Duration;
  LObj.Easing := Easing;
  LObj.Behavior := Behavior;
  LObj.OnUpdated := procedure (const Sender:TTweenElement)
    begin
      Control.Left := round ( Sender.Value );
    end;
end;

procedure TMoveXEffect.DoTearDownTween;
begin
  //Core.Delete("xpos");
end;

//#############################################################################
// TCustomControlEffect
//#############################################################################

Constructor TCustomControlEffect.Create(aControl: TW3MovableControl);
begin
  inherited Create;
  FControl := AControl;
end;

//#############################################################################
// TCustomTweenEffect
//#############################################################################

Constructor TCustomTweenEffect.Create;
begin
  inherited Create;
  FTween:=TTween.Create;
  FTween.OnFinished := HandleTweenDone;
  FTween.OnStarted := HandleTweenStart;
  FTween.OnUpdated := HandleTweenUpdated;
end;

Destructor TCustomTweenEffect.Destroy;
begin
  Ftween.free;
  inherited;
end;

procedure TCustomTweenEffect.DoTearDownTween;
begin
end;

procedure TCustomTweenEffect.DoSetupTween;
begin
end;

procedure TCustomTweenEffect.HandleTweenStart(sender:TObject);
begin
  if assigned(OnEffectStarted) then
  OnEffectStarted(self);
end;

procedure TCustomTweenEffect.HandleTweenDone(sender:TObject);
begin
  // Tear down objects created if required
  DoTearDownTween;

  if assigned(OnEffectDone) then
  OnEffectDone(self);
end;

procedure TCustomTweenEffect.HandleTweenUpdated(Sender:TObject);
begin
end;

procedure TCustomTweenEffect.Execute(const OnReady:TNotifyEvent);
begin
  // Caller supply an onReady event?
  if assigned(OnReady) then
    OnEffectDone := OnReady;

  DoExecute;
end;

procedure TCustomTweenEffect.DoExecute;
begin
  DoSetupTween;
  FTween.Execute;
end;

procedure TCustomTweenEffect.DoCancel;
begin
  FTween.Cancel;
end;

procedure TCustomTweenEffect.DoPause;
begin
  FTween.Pause;
end;

procedure TCustomTweenEffect.DoResume;
begin
  FTween.Resume;
end;

function TCustomTweenEffect.DoGetActive:Boolean;
begin
  result := FTween.Active;
end;

procedure TCustomTweenEffect.Cancel;
begin
  FTween.Cancel;
end;

procedure TCustomTweenEffect.Pause;
begin
  FTween.Pause;
end;

procedure TCustomTweenEffect.Resume;
begin
  FTween.Resume;
end;

//#############################################################################
// TCustomEffect
//#############################################################################

procedure TCustomEffect.DoSetOptions(const Value:TEffectOptions);
begin
  if not DoGetActive then
  begin
    FOptions := Value;
  end else
  raise EEffectError.Create('Options cannot be altered while tween is active error');
end;

procedure TCustomEffect.Execute(const OnReady:TNotifyEvent);
begin
  (* already active? cancel *)
  if DoGetActive then
  begin
    (* Does options allow this behavior? *)
    if (eoCancelOnExecute in FOptions) then
    begin
      Cancel;
    end else
    raise EEffectError.Create('Effect already active error, execute failed');
  end;
  (* Did caller supply an event handler? *)
  if assigned(OnReady) then
    OnEffectDone := OnReady;

  DoExecute;
end;

procedure TCustomEffect.Pause;
begin
  if DoGetActive then
  begin
    DoPause;
  end else
  raise EEffectError.Create('Effect not active error, pause failed');
end;

procedure TCustomEffect.Cancel;
begin
  if DoGetActive then
  begin
    DoCancel;
  end else
  raise EEffectError.Create('Effect not active error, cancel failed');
end;

procedure TCustomEffect.Resume;
begin
  DoResume;
end;


end.

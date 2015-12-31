unit system.animation.effects;

interface

uses 
  SmartCL.System, SmartCL.Graphics, SmartCL.Components, SmartCL.Forms,
  SmartCL.Fonts, SmartCL.Borders, SmartCL.Application,
  System.Types,
  System.Colors,
  system.animation.tween;

type

  TCustomEffect = class(Tobject)
  protected
    procedure DoExecute;virtual;abstract;
    procedure DoCancel;virtual;abstract;
    procedure DoPause;virtual;abstract;
    procedure DoResume;virtual;abstract;
    function  DoGetActive:Boolean;virtual;abstract;
  public
    Property  OnEffectStarted:TNotifyEvent;
    Property  OnEffectDone:TNotifyEvent;
    Property  OnEffectPaused:TNotifyEvent;
    property  OnEffectCanceled:TNotifyEvent;

    Property  Active:Boolean read DoGetActive;
    procedure Execute(OnReady:TNotifyEvent);virtual;
    procedure Cancel;virtual;
    procedure Pause;virtual;
    procedure Resume;virtual;
  end;

  TCustomTweenEffect = class(TCustomEffect)
  private
    FTween:     TW3Tween;
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
    property    Core:TW3Tween read FTween;
  public
    Property    Busy:Boolean read ( FTween.active );

    procedure   Execute(OnReady:TNotifyEvent);override;
    procedure   Cancel;override;
    procedure   Pause;override;
    procedure   Resume;override;

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
    Property    Duration:float;
    Property    FromX: Integer;
    Property    Distance:Integer;
  end;

  TMoveYEffect = class(TCustomControlEffect)
  protected
    procedure   DoSetupTween;override;
    procedure   DoTearDownTween;override;
  public
    Property    Duration:float;
    Property    FromY: Integer;
    Property    Distance:Integer;
  end;

  TPropertyBindingtype = (pbStyle,pbAttribute);

  TPropertyBinding = class(TObject)
  protected
    procedure   HandleElementUpdated(item:TW3TweenElement);
  public
    property    Effect:TCustomControlEffect;
    Property    Tween:TW3TweenElement;
    property    BindingType:TPropertyBindingtype;
    Constructor Create(aEffect:TCustomControlEffect;
                aTween:TW3TweenElement;
                aBindingtype:TPropertyBindingtype);
  end;

  TWidgetEffect = class(TCustomControlEffect)
  private
    FBindings:  Array of TPropertyBinding;
  public
    procedure DoSetupTween;override;
    function Bind(PropertyName:String;BindingType:TPropertyBindingtype):TPropertyBinding;
  end;

implementation

procedure TWidgetEffect.DoSetupTween;
begin
  var Binding := Bind('left',TPropertyBindingtype.pbAttribute);
end;

function TWidgetEffect.Bind(PropertyName:String;BindingType:TPropertyBindingtype):TPropertyBinding;
var
  Ltween: TW3TweenElement;
begin
  Ltween := Core.Add(PropertyName);
  result := TpropertyBinding.Create(self, Ltween, BindingType);
  FBindings.add(result);
end;


//#############################################################################
// TPropertyBinding
//#############################################################################


Constructor TPropertyBinding.Create(aEffect:TCustomControlEffect;
            aTween:TW3TweenElement;
            aBindingtype:TPropertyBindingtype);
begin
  inherited Create;
  Effect := aEffect;
  Tween := aTween;
  Bindingtype := aBindingType;
  Tween.OnUpdated := HandleElementUpdated;
end;

procedure TPropertyBinding.HandleElementUpdated(item:TW3TweenElement);
begin
  case Bindingtype of
  pbStyle:      w3_setStyle(Effect.Control.Handle,item.id,item.value);
  pbAttribute:  w3_SetAttrib(Effect.Control.Handle,item.id,item.value);
  end;
end;

//#############################################################################
// TMoveYEffect
//#############################################################################

procedure TMoveYEffect.DoSetupTween;
var
  LObj: TW3TweenElement;
begin
  Core.OnUpdated := NIL;

  LObj := Core.Add("ypos");
  LObj.StartValue := FromY;
  LObj.Distance := Distance ;
  LObj.Duration := Duration;
  LObj.AnimationType := ttCubeIn;
  LObj.Behavior := tbSingle;
  LObj.OnUpdated := procedure (item:TW3TweenElement)
    begin
      Control.Top := round ( Item.Value );
    end;
end;

procedure TMoveYEffect.DoTearDownTween;
begin
  Core.Delete("ypos");
end;

//#############################################################################
// TMoveXEffect
//#############################################################################

procedure TMoveXEffect.DoSetupTween;
var
  LObj: TW3TweenElement;
begin
  Core.OnUpdated := NIL;

  LObj := Core.Add("xpos");

  Core.SyncRefresh := false;
  Core.Interval := 10;

  LObj.StartValue := FromX;
  LObj.Distance := Distance ;
  LObj.Duration := Duration;
  LObj.AnimationType := ttQuartInOut;
  LObj.Behavior := tbSingle;
  LObj.OnUpdated := procedure (item:TW3TweenElement)
    begin
      Control.Left := round ( Item.Value );
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
  FTween:=TW3Tween.Create;
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

procedure TCustomTweenEffect.Execute(OnReady:TNotifyEvent);
begin
  // Keep onReady callback?
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

procedure TCustomEffect.Execute(OnReady:TNotifyEvent);
begin
  if DoGetActive then
  Cancel;

  DoExecute;
end;

procedure TCustomEffect.Pause;
begin
  DoPause;
end;

procedure TCustomEffect.Cancel;
begin
  DoCancel;
end;

procedure TCustomEffect.Resume;
begin
  DoResume;
end;


end.

unit system.animation.tween;

interface

  {.$DEFINE DELPHI}

uses 
  System.Types,
  SmartCL.Time,
  SmartCL.System;

type
  (* Tweening is essentially just a technique for transforming one number
     into another number over a given time. With "number" we really mean
     just a floating-point value. So all the fancy graphical effects you
     see in mobile apps, games and multimedia caused by tweening - is just
     a numbers being transformed by formulas. But dont worry, we have done all
     the hard work for you.

     A practical example
     ===================
     Let's say you have a button on a form. It's positioned at 10,20 pixels.
     You want to move that button smothly to position 80,100 on the form, and
     you need it done in 0.5 seconds.

     To sum up what we have:
      start x position = 10
      start y position = 20
      stop  x position = 80
      stop  y position = 100
      time = 0.5 seconds


     Since we are tweening (or animating) two values, the X position and Y
     position, we are going to need two tween-elements that are almost
     identical:

      var Engine := TTween.Create;
      var XElement := Engine.Add(
                        'x-pos',
                        10,
                        80-10,
                        0.5,
                        ttlinear,
                        tbSingle);

      var YElement := Engine.Add(
                        'y-pos',
                        20,
                        100-20,
                        0.5,
                        ttlinear,
                        tbSingle);

    I have broken down the parameters to make them easier to explain, so you
    dont need to write your code like this. But let's go through the parameters
    one by one:

    1. First param is a name, or identifier. This is handy if you have a ton
       of tweens going on all the time.

    2. Second parameter is the number you want to change, the start value

    3. Third param is the distance to the target number (!) This is very
       important to remember! its not the actual target number, but the
       distance. So in the code above we subtract the starting value.
       The reason for this choice will become more obvious as you work with
       animations and moving elements around. Moving elements that can
       suddenly change movement are easier to define by distance than absolutes.

    4. Next is the time-frame, in our case that is half a second (0.5)

    5. This parameter is more intricate. It has to do with the formula used
       to transform X1 into X2. It's called "easing" in most frameworks. Some
       formulas give you that iOS delay at the start, then the transformation
       accellerates towards the end. Another formula moves faster at the
       beginning and slows down towards the end.
       Just play around with different animation-types and find one that suits
       your taste and requirements (see: TTweenEasingType)

    6. This parameters is important. It defined if you tween should be
       executed once (tbSingle) or if it should be repeated until you stop, pause or
       dispose of the tween element (tbRepeat). You can also make it move back and fourth
       between the start and stop values (tbOscillate).


    Running the tween
    =================

    With our tween elements defined, we want to achieve two things:

      1. be able to catch the number changes
      2. dispose of the tween elements when done.


    Both tasks can be achieved with simple event handlers:

      XElement.OnUpdated := procedure (const Sender:TTweenElement)
        begin
          w3button1.left := round( sender.Value );
        end;

      YElement.OnUpdated := procedure (const Sender:TTweenElement)
        begin
          w3button1.top := round( sender.Value );
        end;

    To execute both tweens its just a matter of calling:

      Engine.Execute();


    And now the button we wanted to move will do just that, and when everything
    is finished you can safely delete the tween elements, re-start them, or
    just free the whole engine.

    Naturally, doing things like this may not always be the best. You typically
    use just one engine throughout your entire application or game, but since
    we have OOP you can actually have 1, 2 or 100 tween engines, each handling
    hundreds of child-elements at any given time.
    *)



  (* The tween animation type defined the formula the tween-engine uses
     to transform your values. *)
  TTweenEasingType = (
    ttlinear,
    ttQuadIn,
    ttQuadOut,
    ttQuadInOut,
    ttCubeIn,
    ttCubeOut,
    ttCubeInOut,
    ttQuartIn,
    ttQuartOut,
    ttQuartInOut,
    ttQuintIn,
    ttQuintOut,
    ttQuintInOut,
    ttSineIn,
    ttSineOut,
    ttSineInOut,
    ttExpoIn,
    ttExpoOut,
    ttExpoInOut
    );

  TTweenBehavior = (
    tbSingle,
    tbRepeat,
    tbOscillate
    );

  TTweenState = (
    tsIdle,
    tsRunning,
    tsPaused,
    tsDone
    );

  (* Exception class for general TTween errors *)
  ETweenError = class(EW3Exception);

  (* Forward declarations *)
  TTweenData    = class;
  TTweenElement = class;
  TTween        = class;

  TTweenUpdatedEvent      = procedure (Sender:TObject);
  TTweenStartedEvent      = procedure (sender:TObject);
  TTweenFinishedEvent     = procedure (sender:TObject);
  TTweenFinishedPartialEvent = procedure (sender:TObject);

  TTweenItemResumedEvent  = procedure (const Sender:TTweenElement);
  TTweenItemPausedEvent   = procedure (const Sender:TTweenElement);
  TTweenItemFinishedEvent = procedure (const Sender:TTweenElement);
  TTweenItemStartedEvent  = procedure (const Sender:TTweenElement);
  TTweenItemUpdatedEvent  = procedure (const Sender:TTweenElement);


  TTweenData = class(TObject)
  public
    Property  Id: String;
    Property  StartTime: TDateTime;
    Property  StartValue: double;
    Property  Distance: double;
    Property  Duration: double;
    Property  Easing: TTweenEasingType;
    Property  Behavior: TTweenBehavior;

    function  Expired: Boolean;virtual;
    Procedure Reset;virtual;
  end;

  TTweenElement = class(TTweenData)
  private
    FState:     TTweenState;
    FValue:     Double;
    FOnPaused:  TTweenItemPausedEvent;
    FOnStarted: TTweenItemStartedEvent;
    FOnResumed: TTweenItemResumedEvent;
    FOnUpdated: TTweenItemUpdatedEvent;
    FOnFinished:TTweenItemFinishedEvent;
  public
    (* These properties have nothing to do with HTML tags, but are
       just for attaching user-defined values *)
    property    Tag: integer;
    property    TagObject: TObject;

    property    State:TTweenState read FState write FState;
    property    Value:double read FValue write FValue;

    property    OnStarted: TTweenItemStartedEvent read FOnStarted write FOnStarted;
    property    OnFinished: TTweenItemFinishedEvent read FOnFinished write FOnFinished;
    property    OnPaused: TTweenItemPausedEvent read FOnPaused write FOnPaused;
    property    OnResumed: TTweenItemResumedEvent read FOnResumed write FOnResumed;
    property    OnUpdated: TTweenItemUpdatedEvent read FOnUpdated write FOnUpdated;

    procedure   Update(const aValue:double);virtual;

    procedure   Reset;override;
    Constructor Create(AOwner:TTween);virtual;
  end;

  TTween = class
  private
    FTimer:     TW3Timer;
    FValues:    Array of TTweenElement;
    FActive:    Boolean;
    FPartial:   Boolean;
    FInterval:  Integer;
    FQRLUT:     Array[TTweenEasingType] of function (t, b, c, d:double):double;
    FNameLUT:   Variant; // USES JS BASED INDEX
    procedure SetInterval(const Value:Integer);
  protected
    procedure HandleSyncUpdate;virtual;
    procedure HandleUpdateTimer(Sender:TObject);virtual;
    function  Update(const Item:TTweenElement):double;virtual;
  protected
    procedure TweenStarted(const Item:TTweenElement);virtual;
    procedure TweenComplete(const Item:TTweenElement);virtual;
    procedure TweenPaused(const Item:TTweenElement);virtual;
    procedure TweenResumed(const Item:TTweenElement);virtual;
  protected
    function  Linear(t,b,c,d:double):double;
    function  QuadIn(t, b, c, d:double):double;
    function  QuadOut(t, b, c, d:double):double;
    function  QuadInOut(t, b, c, d:double):double;
    function  CubeIn(t, b, c, d:double):double;
    function  CubeOut(t, b, c, d:double):double;
    function  CubeInOut(t, b, c, d:double):double;
    function  QuartIn(t, b, c, d:double):double;
    function  QuartOut(t, b, c, d:double):double;
    function  QuartInOut(t, b, c, d:double):double;
    function  QuintIn(t, b, c, d:double):double;
    function  QuintOut(t, b, c, d:double):double;
    function  QuintInOut(t, b, c, d:double):double;
    function  SineIn(t, b, c, d:double):double;
    function  SineOut(t, b, c, d:double):double;
    function  SineInOut(t, b, c, d:double):double;
    function  ExpoIn(t, b, c, d:double):double;
    function  ExpoOut(t, b, c, d:double):double;
    function  ExpoInOut(t, b, c, d:double):double;
  public
    function  ObjectOf(const Id:String):TTweenElement;
    function  IndexOf(Id:String):Integer;

    property  Active:Boolean read ( FActive );
    property  Item[const index:Integer]:TTweenElement read (FValues[index]);
    property  Tween[const Id:String]:TTweenElement read ObjectOf;default;
    property  Count:Integer read ( FValues.Length );
    property  Interval:Integer read FInterval write SetInterval;

    property  SyncRefresh:Boolean;
    property  IgnoreOscillate:Boolean;

    function  Add(Id:String):TTweenElement;overload;

    function  Add(Id:String;const aStartValue,aDistance,aDuration:double;
              const aAnimationType:TTweenEasingType;
              const aBehavior:TTweenBehavior):TTweenElement;overload;

    function  Add(const Instance:TTweenElement):TTweenElement;overload;

    procedure Delete(index:Integer);overload;
    procedure Delete(Id:String);overload;
    procedure Delete(const TweenIds:TStrArray);overload;

    procedure Clear;overload;

    procedure Execute(const Finished:TProcedureRef);overload;
    procedure Execute;overload;
    procedure Execute(const TweenObjects:Array of TTweenElement);overload;

    procedure Pause(const Index:Integer);overload;
    procedure Pause(const Tween:TTweenElement);overload;
    procedure Pause(const Objs:Array of TTweenElement);overload;
    procedure Pause(const Ids:Array of String);overload;
    procedure Pause;overload;

    procedure Resume(const index:Integer);overload;
    procedure Resume(const Tween:TTweenElement);overload;
    procedure Resume(const Objs:Array of TTweenElement);overload;
    procedure Resume(const Ids:Array of String);overload;
    procedure Resume;overload;

    procedure Cancel;overload;

    class function TimeCode:double;

    constructor Create;virtual;
    destructor Destroy;Override;
  published
    property OnPartialFinished:TTweenFinishedPartialEvent;
    property OnUpdated:   TTweenUpdatedEvent;
    property OnFinished:  TTweenFinishedEvent;
    property OnStarted:   TTweenStartedEvent;
  end;

implementation

//############################################################################
// Exception Error Messages
//############################################################################

Resourcestring
CNT_TWEEN_EXEC_EXISTS_ID =
"Execute failed, a tween-object with id [%s] already exists error";

CNT_TWEEN_EXEC_FAILED_ID =
"Execute failed, element does not have a valid id error";

CNT_TWEEN_EXEC_BUSY =
"Execute failed, tween already active error";

CNT_ERR_TWEEN_ELEMENT_EMPTY_ID =
"Failed to add tween-element, invalid [empty] id error";

CNT_ERR_TWEEN_ELEMENT_DUPLICATE_ID =
"Failed to add tween-element, [%s] already exists in the collection error";

CNT_ERR_TWEEN_ELEMENT_EXISTS =
"Failed to add tween-element [%s], element already exists in collection error";

//############################################################################
// TTween
//############################################################################

constructor TTween.Create;
begin
  inherited Create;
  FTimer := TW3Timer.Create;

  FNameLUT := TVariant.CreateObject;

  FInterval := 10;
  IgnoreOscillate := true;
  SyncRefresh := false;

  // Build Lookup-Table for faster access
  FQRLUT[ttlinear]      := @Linear;
  FQRLUT[ttQuadIn]      := @QuadIn;
  FQRLUT[ttQuadOut]     := @QuadOut;
  FQRLUT[ttQuadInOut]   := @QuadInOut;
  FQRLUT[ttCubeIn]      := @CubeIn;
  FQRLUT[ttCubeOut]     := @CubeOut;
  FQRLUT[ttCubeInOut]   := @CubeInOut;
  FQRLUT[ttQuartIn]     := @QuartIn;
  FQRLUT[ttQuartOut]    := @QuartOut;
  FQRLUT[ttQuartInOut]  := @QuartInOut;
  FQRLUT[ttQuintIn]     := @QuintIn;
  FQRLUT[ttQuintOut]    := @QuintOut;
  FQRLUT[ttQuintInOut]  := @QuintInOut;
  FQRLUT[ttSineIn]      := @SineIn;
  FQRLUT[ttSineOut]     := @SineOut;
  FQRLUT[ttSineInOut]   := @SineInOut;
  FQRLUT[ttExpoIn]      := @ExpoIn;
  FQRLUT[ttExpoOut]     := @ExpoOut;
  FQRLUT[ttExpoInOut]   := @ExpoInOut;
end;

destructor TTween.Destroy;
begin
  FTimer.free;
  Cancel;
  Clear;
  inherited;
end;

procedure TTween.Clear;
begin
  (* Pause update timer if active *)
  if FTimer.Enabled then
    FTimer.Enabled := false;

  While FValues.Count>0 do
  begin
    var LIndex := FValues.Count-1;
    var LObj := FValues[LIndex];
    if LObj<>NIL then
    begin
      FValues.delete(LIndex,1);
      LObj.free;
    end;
  end;
  FNameLUT := TVariant.CreateObject;
end;

class function TTween.TimeCode:double;
begin
  {$IFDEF DELPHI}
  result := MilliSecondsBetween(now,EncodeDateTime(1970,01,01,0,0,0,0));
  {$ELSE}
  asm
    @result = Date.now();
  end;
  {$ENDIF}
end;

procedure TTween.TweenResumed(const Item:TTweenElement);
begin
  if assigned(Item.OnResumed) then
  Item.OnResumed(Item);
end;

procedure TTween.SetInterval(Const Value:Integer);
begin
  {$IFDEF DELPHI}
  FInterval := math.EnsureRange(value,1,10000);
  {$ELSE}
  FInterval := TInteger.EnsureRange(Value,1,10000);
  {$ENDIF}
end;

procedure TTween.TweenPaused(const Item:TTweenElement);
begin
  if assigned(Item.OnPaused) then
    Item.OnPaused(Item);
end;

procedure TTween.TweenComplete(const Item:TTweenElement);
begin
  if assigned(Item.OnFinished) then
    Item.OnFinished(Item);
end;

procedure TTween.TweenStarted(const Item:TTweenElement);
begin
  if assigned(Item.OnStarted) then
    Item.OnStarted(Item);
end;

function TTween.Update(const Item:TTweenElement):double;
var
  LTotal: double;
begin
  if not Item.Expired then
  begin
    LTotal := FQRLUT[item.Easing](TimeCode-Item.StartTime,
                      Item.StartValue,
                      Item.Distance,
                      Item.Duration);
  end else
  if Item.behavior = tbSingle then
  begin
    LTotal := Item.StartValue + Item.Distance;
  end else
  if Item.behavior = tbRepeat then
  begin
    Item.StartTime := TimeCode;
    LTotal := FQRLUT[item.Easing](TimeCode-Item.StartTime,
                      Item.StartValue,
                      Item.Distance,
                      Item.Duration);
  end else
  if Item.behavior = tbOscillate then
  begin
    Item.StartValue := Item.StartValue + Item.Distance;
    Item.Distance := -Item.Distance;
    Item.StartTime := TimeCode;
    LTotal := FQRLUT[item.Easing](TimeCode-Item.StartTime,
                      Item.StartValue,
                      Item.Distance,
                      Item.Duration);
    Item.State := tsDone;
  end;

  result := Round( LTotal * 100) / 100;
end;

procedure TTween.HandleUpdateTimer(Sender:TObject);
var
  LItem:  TTweenElement;
  LCount: Integer;
  LDone:  Integer;
begin
  (* Tween objects cleared while active? *)
  if FValues.Length<1 then
  begin
    Cancel;
    exit;
  end;

  LCount := 0;
  LDone  := 0;
  for LItem in FValues do
  begin
    (* The start time-code is set in the first update *)
    if LItem.State=tsIdle then
    begin
      LItem.State := tsRunning;
      TweenStarted(LItem);
      LItem.StartTime := TimeCode;
    end;

    // Animation paused? Continue with next
    if LItem.State = tsPaused then
    continue;

    // Expired? Keep track of it
    if LItem.Expired then
    begin
      if IgnoreOscillate then
      begin
        //if (LItem.Behavior <> tbOscillate) then
        if (LItem.Behavior = tbSingle) then
        inc(LCount) else
        inc(LDone);
      end else
      inc(LCount);
    end;

    // Update the element with the new value
    LItem.Update(Update(Litem));

    // finished on this run?
    if LItem.Expired then
    begin
      if not Litem.State = tsDone then
      begin
        LItem.State := tsDone;
        TweenComplete(LItem);
      end;
    end;

  end;

  if assigned(OnUpdated) then
  OnUpdated(Self);

  if LCount = (FValues.Length - LDone) then
  begin
    if IgnoreOscillate then
    begin
      if not FPartial then
      begin
        FPartial := True; // make sure this happens only once!
        if assigned(OnPartialFinished) then
        OnPartialFinished(self);
      end;
    end;
  end;

  (* If all tweens have expired, stop the animation *)
  If LCount = FValues.Length then
  begin
    Cancel;
  end;
end;

procedure TTween.HandleSyncUpdate;
begin
  HandleUpdateTimer(NIL);
  if Active then
  W3_RequestAnimationFrame(HandleSyncUpdate);
end;

procedure TTween.Execute(Const TweenObjects:Array of TTweenElement);
var
  LItem:  TTweenElement;
  LId:    String;
begin
  if not Active then
  begin
    if TweenObjects.length>0 then
    begin
      for LItem in TweenObjects do
      begin
        LId := LItem.Id.Trim;
        if LId.length>0 then
        begin

          if self.IndexOf(LId)<0 then
          begin
            // Add to LUT
            FNameLUT[LItem.Id] := LItem;
            FValues.add(LItem);
          end else
          Raise ETweenError.CreateFmt(CNT_TWEEN_EXEC_EXISTS_ID,[LId]);
        end else
        Raise ETweenError.Create(CNT_TWEEN_EXEC_FAILED_ID);
      end;
    end;

    Execute;

  end else
  raise ETweenError.Create(CNT_TWEEN_EXEC_BUSY);
end;

procedure TTween.Execute(const Finished:TProcedureRef);
begin
  self.OnFinished := procedure (sender:Tobject)
    begin
      if assigned(Finished) then
        Finished;
    end;
  Execute;
end;

procedure TTween.Execute;
begin
  if not Active then
  begin

    FPartial := false;

    case SyncRefresh of
    true:
      begin
        // Initiate loop in 100ms
        W3_SetTimeOut( procedure ()
          begin
            W3_RequestAnimationFrame( HandleSyncUpdate );
          end, 100);
      end;
    false:
      begin
        FTimer.OnTime := HandleUpdateTimer;
        FTimer.Delay := Interval;
        FTimer.Enabled := true;
      end;
    end;

    FActive := True;
    if assigned(OnStarted) then
    OnStarted(self);

  end else
  raise ETweenError.Create(CNT_TWEEN_EXEC_BUSY);
end;

procedure TTween.Delete(const TweenIds:TStrArray);
var
  Lid:  String;
  LObj: TTweenElement;
  LIndex: Integer;
begin
  if tweenIds.length>0 then
  begin
    // Only remove tweens defined in Parameter list
    for LId in Tweenids do
    begin
      LObj := ObjectOf(Lid);
      if LObj<>NIL then
      begin
        LIndex := FValues.IndexOf(LObj);
        FValues.Delete(LIndex,1);
        asm
          delete (@self).FNameLut[@LId];
        end;
        LObj.free;
      end;
    end;
  end;
end;

procedure TTween.Resume(const index:Integer);
var
  LObj: TTweenElement;
begin
  if Active then
  begin
    if (Index>=0) and (Index<FValues.Count) then
    begin
      LObj := FValues[index];
      if LObj.State=tsPaused then
      begin
        LObj.StartTime := TimeCode;
        LObj.State := tsRunning;
        TweenResumed(LObj);
      end;
    end;
  end;
end;

procedure TTween.Resume(const Tween:TTweenElement);
begin
  if Active then
  Begin
    if Tween<>NIL then
    Begin
      if FValues.IndexOf(Tween)>=0 then
      begin
        if Tween.state=tsPaused then
        begin
          Tween.State := tsRunning;
          Tween.StartTime := TimeCode;
          TweenResumed(Tween);
        end;
      end;
    end;
  end;
end;

procedure TTween.Resume(const Objs:Array of TTweenElement);
var
  LObj: TTweenElement;
begin
  if Active then
  begin
    if Objs.length>0 then
    Begin
      for LObj in Objs do
      begin
        if LObj<>NIl then
        begin
          if LObj.State=tsPaused then
          begin
            LObj.state := tsRunning;
            LObj.StartTime := TimeCode;
            TweenResumed(LObj);
          end;
        end;
      end;
    end;
  end;
end;

procedure TTween.Resume(const Ids:Array of String);
var
  LId:  String;
begin
  if Active then
  begin
    for LId in Ids do
    begin
      var LObj := ObjectOf(Lid);
      if LObj<>NIL then
      Begin
        if LObj.State = tsPaused then
        begin
          LObj.State := tsRunning;
          LObj.StartTime := TimeCode;
          TweenResumed(LObj);
        end;
      end;
    end;
  end;
end;

procedure TTween.Resume;
var
  LObj: TTweenElement;
begin
  if Active then
  begin
    if FValues.length>0 then
    Begin
      for LObj in FValues do
      begin
        if LObj<>NIl then
        begin

          if LObj.state=tsPaused then
          begin
            LObj.State := tsRunning;
            LObj.StartTime := TimeCode;
            TweenResumed(LObj);
          end;

        end;
      end;
    end;
  end;
end;

Procedure TTween.Pause(const Index:Integer);
var
  LObj: TTweenElement;
begin
  if Active then
  begin
    if (Index>=0) and (Index<FValues.Count) then
    begin
      LObj := FValues[index];
      if LObj.State=tsRunning then
      begin
        LObj.State := tsPaused;
        TweenPaused(LObj);
      end;
    end;
  end;
end;

procedure TTween.Pause(const Tween:TTweenElement);
begin
  if Active then
  Begin
    if Tween<>NIL then
    Begin
      if FValues.IndexOf(Tween)>=0 then
      begin
        if Tween.state=tsRunning then
        begin
          Tween.State := tsPaused;
          TweenPaused(Tween);
        end;
      end;
    end;
  end;
end;

procedure TTween.Pause(const Objs:Array of TTweenElement);
var
  LObj: TTweenElement;
begin
  if Active then
  begin
    if Objs.length>0 then
    Begin
      for LObj in Objs do
      begin
        if LObj<>NIl then
        begin
          if LObj.State = tsRunning then
          begin
            LObj.State := tsPaused;
            TweenPaused(LObj);
          end;
        end;
      end;
    end;
  end;
end;

procedure TTween.Pause(const Ids:Array of String);
var
  LId:  String;
begin
  if Active then
  begin
    for LId in Ids do
    begin
      var LObj := ObjectOf(LId);
      if LObj<>NIL then
      begin
        if LObj.State = tsRunning then
        begin
          LObj.State := tsPaused;
          TweenPaused(LObj);
        end;
      end;
    end;
  end;
end;

procedure TTween.Pause;
var
  LObj: TTweenElement;
begin
  if Active then
  begin
    if FValues.length>0 then
    Begin
      for LObj in FValues do
      begin
        if LObj.State = tsRunning then
        begin
          LObj.State := tsPaused;
          TweenPaused(LObj);
        end;
      end;
    end;
  end;
end;

procedure TTween.Cancel;
begin
  if Active then
  begin
    try
      FTimer.enabled := false;
      FTimer.OnTime := NIL;
    finally
      FActive := false;

      if assigned(OnFinished) then
      OnFinished(self);
    end;
  end;
end;

Procedure TTween.Delete(index:Integer);
var
  LObj: TTweenElement;
  LId:  String;
begin
  if (index>=0) and (index<FValues.count) then
  begin
    LObj:=FValues[index];
    LId := LObj.id;
    FValues.Delete(Index,1);

    asm
      delete (@self).FNameLUT[@LId];
    end;

    LObj.free;
  end;
end;

procedure TTween.Delete(Id:String);
begin
  Delete(FValues.indexOf(ObjectOf(Id)));
end;

function TTween.Add(const Instance:TTweenElement):TTweenElement;
begin
  result := Instance;
  if Instance<>NIL then
  begin
    if FValues.IndexOf(Instance)<0 then
    begin
      var id := Instance.id.trim.lowercase;
      if id.length>0 then
      begin
        if IndexOf(id)>=0 then
        begin
          FNameLUT[Instance.Id] := Instance;
          FValues.Add(Instance);
        end else
        Raise ETweenError.CreateFmt(CNT_ERR_TWEEN_ELEMENT_DUPLICATE_ID,[Id]);
      end else
      Raise ETweenError.Create(CNT_ERR_TWEEN_ELEMENT_EMPTY_ID);
    end else
    Raise ETweenError.CreateFmt(CNT_ERR_TWEEN_ELEMENT_EXISTS,[Instance.Id]);
  end;
end;

function TTween.Add(Id:String):TTweenElement;
begin
  Id := id.trim.lowercase;
  if id.length>0 then
  begin
    if IndexOf(Id)<0 then
    begin
      result := TTweenElement.Create(self);
      result.Id := Id;
      FNameLUT[Id] := result;
      FValues.add(result);
    end else
    raise ETweenError.CreateFmt(CNT_ERR_TWEEN_ELEMENT_DUPLICATE_ID,[Id]);
  end else
  raise ETweenError.Create(CNT_ERR_TWEEN_ELEMENT_EMPTY_ID);
end;

Function TTween.Add(Id:String;const aStartValue,aDistance,aDuration:double;
          const aAnimationType:TTweenEasingType;
          const aBehavior:TTweenBehavior):TTweenElement;
begin
  Id := id.trim.lowercase;
  if id.length>0 then
  begin
    if IndexOf(Id)<0 then
    begin
      result := TTweenElement.Create(self);
      result.StartValue := aStartValue;
      result.Distance := aDistance;
      result.Duration := aDuration;
      result.Easing := aAnimationtype;
      result.Behavior := aBehavior;
      result.StartTime := TimeCode;
      result.Id := Id;
      FNameLUT[Id] := result;
      FValues.add(result);
    end else
    raise ETweenError.CreateFmt(CNT_ERR_TWEEN_ELEMENT_DUPLICATE_ID,[Id]);
  end else
  raise ETweenError.Create(CNT_ERR_TWEEN_ELEMENT_EMPTY_ID);
end;

function TTween.IndexOf(Id:String):Integer;
var
  x:  Integer;
begin
  result := -1;
  id := Id.trim.lowercase;
  if id.length>0 then
  begin
    for x:=0 to FValues.Count-1 do
    begin
      if Id.EqualsText(FValues[x].Id) then
      begin
        result := x;
        break;
      end;
    end;
  end;
end;

function TTween.ObjectOf(const Id:String):TTweenElement;
begin
  var ref := FNameLUT[id.trim.tolower];
  asm
    @result = @ref;
  end;
end;

{$HINTS OFF}
function TTween.ExpoIn(t, b, c, d:double):double;
begin
  result := c * power(2,10 * (t/d-1))+b;
end;

function TTween.ExpoOut(t, b, c, d:double):double;
begin
  result := c * (-power(2,-10 * t/d)+1)+b;
end;

function TTween.ExpoInOut(t, b, c, d:double):double;
begin
  t := t / ( d / 2);
  if (t<1) then
  begin
    result := c/2 * power(2,10 * (t-1)) + b;
  end else
  begin
    t:=t-1;
    result := c/2 * (power(2,-10*t)+2)+b;
  end;
end;

function TTween.SineIn(t, b, c, d:double):double;
begin
  result := -c * cos(t/d * (PI / 2)) + c + b;
end;

function TTween.SineOut(t, b, c, d:double):double;
begin
  result := c * cos(t/d * (PI / 2)) + b;
end;

function TTween.SineInOut(t, b, c, d:double):double;
begin
  result := -c / 2 * (cos( PI * t / d) -1) + b;
end;

function TTween.QuintIn(t, b, c, d:double):double;
begin
  t := t / d;
  result := c*t*t*t*t*t+b
end;

function TTween.QuintOut(t, b, c, d:double):double;
begin
  t := t / d;
  t := t -1;
  result := c * (t*t*t*t*t+1) + b;
end;

function TTween.QuintInOut(t, b, c, d:double):double;
begin
  t := t / (d / 2);
  if (t<1) then
  begin
    result := c/2 * t * t * t * t * t + b;
  end else
  begin
    t:=t-2;
    result := c/2 * (t*t*t*t*t+2) +b;
  end;
end;

function TTween.QuartIn(t, b, c, d:double):double;
begin
  t := t / d;
  result := c * t * t * t * t + b;
end;

function TTween.QuartOut(t, b, c, d:double):double;
begin
  t := t / d;
  t := t - 1;
  result := -c * (t * t * t * t - 1) + b;
end;

function TTween.QuartInOut(t, b, c, d:double):double;
begin
  t := t / (d/2);
  if (t<1) then
  begin
    result := c/2 * t * t * t * t + b;
  end else
  begin
    t := t - 2;
    result := -c / 2 * (t * t * t * t - 2) + b;
  end;
end;

function TTween.CubeInOut(t, b, c, d:double):double;
begin
  t := t / (d / 2);
  if ( t < 1) then
  begin
    result := c / 2 * (t * t * t) + b;
  end else
  begin
    t := t -2;
    result := c/2 * (t*t*t + 2) + b;
  end;
end;

function TTween.CubeOut(t, b, c, d:double):double;
begin
  t := t / d;
  t := t - 1;
  result := c * (t * t * t + 1) + b;
end;

function TTween.CubeIn(t, b, c, d:double):double;
begin
  t := t / d;
  result := c * t * t * t + b;
end;

function TTween.QuadInOut(t, b, c, d:double):double;
begin
  t := t / (d / 2);
  if (t<1) then
  begin
    result := c / 2 * t * t + b;
    exit;
  end else
  begin
    t := t -1;
    result := -c / 2 * (t * (t - 2) -1) + b;
  end;
end;

function TTween.QuadOut(t, b, c, d:double):double;
begin
  t := t / d;
  result := -c * t * (t - 2) + b;
end;

function TTween.QuadIn(t, b, c, d:double):double;
begin
  t := t / d;
  result := c * t * t + b;
end;

function TTween.Linear(t,b,c,d:double):double;
begin
  result := c * t / d + b;
end;
{$HINTS ON}

//############################################################################
// TTweenData
//############################################################################

function TTweenData.Expired: Boolean;
begin
  result := StartTime + Duration < TTween.TimeCode;
end;

Procedure TTweenData.Reset;
begin
  StartTime := 0;
  StartValue := 0;
  Distance := 0;
  Duration := 0;
  Easing := ttlinear;
  Behavior := tbSingle;
end;

//############################################################################
// TTweenElement
//############################################################################

Constructor TTweenElement.Create(AOwner:TTween);
begin
  inherited Create();
  State := tsIdle;
end;

Procedure TTweenElement.Reset;
begin
  inherited Reset;
  State := tsIdle;
end;

procedure TTweenElement.Update(const aValue:double);
begin
  Value := aValue;
  if assigned(OnUpdated) then
  OnUpdated(self);
end;

end.

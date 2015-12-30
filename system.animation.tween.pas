unit system.animation.tween;

interface

uses 
  System.Types,
  SmartCL.Time,
  SmartCL.System;

type

  TW3TweenAnimationType = (
    ttlinear,
    ttQuadIn,
    ttQuadOut,
    ttQuadInOut,
    ttCubeIn,
    ttCubeOut,
    ttCubeInOut,
    ttQuartIn,
    ttQuartOut,
    ttQuartInOut
    );

  TTweenBehavior = (
    tbSingle,         // Execute once and then stops
    tbRepeat,         // Repeats the tween sequence
    tbOscillate      // Executes between A and B in oscillating manner
    );

  TTweenData    = class;
  TTweenElement = class;
  TW3TweenEase  = class;
  TW3Tween      = class;

  TW3TweenEase = class
  public
    class function  Linear(t,b,c,d:float):float;
    class function  QuadIn(t, b, c, d:float):float;
    class function  QuadOut(t, b, c, d:float):float;
    class function  QuadInOut(t, b, c, d:float):float;
    class function  CubeIn(t, b, c, d:float):float;
    class function  CubeOut(t, b, c, d:float):float;
    class function  CubeInOut(t, b, c, d:float):float;
    class function  QuartIn(t, b, c, d:float):float;
    class function  QuartOut(t, b, c, d:float):float;
    class function  QuartInOut(t, b, c, d:float):float;
  end;

  TW3TweenItemUpdatedEvent = procedure (Item:TTweenElement);
  TW3TweenUpdatedEvent = procedure (Sender:TObject);
  TW3TweenStartedEvent = procedure (sender:TObject);
  TW3TweenFinishedEvent = procedure (sender:TObject);
  TW3TweenFinishedPartialEvent = procedure (sender:TObject);

  TTweenState = (tsIdle,tsRunning,tsPaused,tsDone);

  TTweenData = class
  public
    Property    Id: String;
    Property    StartTime: TDateTime;
    Property    StartValue: Float;
    Property    Distance: Float;
    Property    Duration: Float;
    Property    AnimationType: TW3TweenAnimationType;
    Property    Behavior: TTweenBehavior;

    function    Expired: Boolean;virtual;
    Procedure   Reset;virtual;
  end;

  TTweenElement = class(TTweenData)
  public
    Property    State:TTweenState;
    Property    Value:Float;

    Property    OnFinished:TNotifyEvent;
    Property    OnUpdated:TW3TweenItemUpdatedEvent;

    procedure   Update(const aValue:Float);virtual;

    Procedure   Reset;override;
    Constructor Create;virtual;
  end;

  TW3Tween = class
  private
    FTimer:     TW3Timer;
    FValues:    Array of TTweenElement;
    FActive:    Boolean;
    FPartial:   Boolean;
    FInterval:  Integer;
  protected
    Procedure   HandleSyncUpdate;virtual;
    procedure   HandleUpdateTimer(Sender:TObject);virtual;
    function    Update(const Item:TTweenElement):Float;virtual;
  public

    function    ObjectOf(const Id:String):TTweenElement;
    function    IndexOf(Id:String):Integer;

    Property    Active:Boolean read ( FActive );
    Property    Item[const index:Integer]:TTweenElement read (FValues[index]);
    property    Tween[const Id:String]:TTweenElement read ObjectOf;default;
    property    Count:Integer read ( FValues.Length );
    Property    Interval:Integer read FInterval write ( TInteger.EnsureRange(Value,1,10000) );

    Property    SyncRefresh:Boolean;
    Property    IgnoreOscillate:Boolean;

    function    Add(Id:String):TTweenElement;overload;

    Function    Add(Id:String;const aStartValue,aDistance,aDuration:float;
                const aAnimationType:TW3TweenAnimationType;
                const aBehavior:TTweenBehavior):TTweenElement;overload;

    Procedure   Delete(index:Integer);overload;
    procedure   Delete(Id:String);overload;
    procedure   Delete(const TweenIds:Array of String);overload;

    procedure   Clear;overload;

    procedure   Execute(Finished:TProcedureRef);overload;
    procedure   Execute;overload;
    procedure   Execute(const TweenObjects:Array of TTweenElement);overload;

    Procedure   Pause(const Index:Integer);overload;
    procedure   Pause(const Tween:TTweenElement);overload;
    procedure   Pause(const Objs:Array of TTweenElement);overload;
    procedure   Pause(const Ids:Array of String);overload;
    procedure   Pause;overload;

    Procedure   Resume(const index:Integer);overload;
    procedure   Resume(const Tween:TTweenElement);overload;
    procedure   Resume(const Objs:Array of TTweenElement);overload;
    procedure   Resume(const Ids:Array of String);overload;
    procedure   Resume;overload;

    procedure   Cancel;overload;

    Constructor Create;virtual;
    Destructor  Destroy;Override;

  published
    Property    OnPartialFinished:TW3TweenFinishedPartialEvent;
    Property    OnUpdated:TW3TweenUpdatedEvent;
    Property    OnFinished:TW3TweenFinishedEvent;
    Property    OnStarted:TW3TweenStartedEvent;
  end;


function GetTimeCode:float;
function Round100(const Value:float):float;

implementation

Function GetTimeCode:float;
begin
  asm
    @result = Date.now();
  end;
end;

function Round100(const Value:float):float;
begin
  result := Round( Value * 100) / 100;
end;

//############################################################################
// TW3Tween
//############################################################################

Constructor TW3Tween.Create;
begin
  inherited Create;
  FTimer := TW3Timer.Create;
  Interval := 10;
  IgnoreOscillate := true;
end;

Destructor  TW3Tween.Destroy;
begin
  Cancel;
  Clear;
  FTimer.free;
  inherited;
end;

procedure TW3Tween.Clear;
begin
  While FValues.length>0 do
  begin
    FValues[FValues.length-1].free;
    Fvalues.Delete(FValues.length-1,1);
  end;
end;

function TW3Tween.Update(const Item:TTweenElement):Float;
var
  LTotal: float;

  function PerformX(t, b, c, d:float):float;
  begin
    result := 0.0;
    case Item.AnimationType of
    ttlinear:     result := TW3TweenEase.Linear(t,b,c,d);
    ttQuadIn:     result := TW3TweenEase.QuadIn(t,b,c,d);
    ttQuadOut:    result := TW3TweenEase.QuadOut(t,b,c,d);
    ttQuadInOut:  result := TW3TweenEase.QuadInOut(t,b,c,d);
    ttCubeIn:     result := TW3TweenEase.CubeIn(t,b,c,d);
    ttCubeOut:    result := TW3TweenEase.CubeOut(t,b,c,d);
    ttCubeInOut:  result := TW3TweenEase.CubeInOut(t,b,c,d);
    ttQuartIn:    result := TW3TweenEase.QuartIn(t,b,c,d);
    ttQuartOut:   result := TW3TweenEase.QuartOut(t,b,c,d);
    ttQuartInOut: result := TW3TweenEase.QuartInOut(t,b,c,d);
    end;
  end;

begin
  if not Item.Expired then
  begin
    LTotal := PerformX(GetTimeCode-Item.StartTime,
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
    Item.StartTime := GetTimeCode;
    LTotal := PerformX(GetTimeCode-Item.StartTime,
                      Item.StartValue,
                      Item.Distance,
                      Item.Duration);
  end else
  if Item.behavior = tbOscillate then
  begin
    Item.StartValue := Item.StartValue + Item.Distance;
    Item.Distance := -Item.Distance;
    Item.StartTime := GetTimeCode;
    LTotal := PerformX(GetTimeCode-Item.StartTime,
                      Item.StartValue,
                      Item.Distance,
                      Item.Duration);
    Item.State := tsDone;
  end;

  result := Round100(LTotal);
end;

procedure TW3Tween.HandleUpdateTimer(Sender:TObject);
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
      LItem.StartTime := GetTimeCode;
      LItem.State := tsRunning;
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
    LItem.Update(Update(LItem));

    // finished on this run?
    if LItem.Expired then
    begin
      if not Litem.State = tsDone then
      begin
        LItem.State := tsDone;
        if assigned(LItem.OnFinished) then
        LItem.OnFinished(LItem);
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
    //Writeln('Stopping at ' + LCount.toString + ' tweens done');
    Cancel;
  end;
end;

Procedure TW3Tween.HandleSyncUpdate;
begin
  HandleUpdateTimer(NIL);
  if Active then
  W3_RequestAnimationFrame(HandleSyncUpdate);
end;

procedure TW3Tween.Execute(Const TweenObjects:Array of TTweenElement);
var
  LItem:  TTweenElement;
  LId:    String;
begin
  if not Active then
  begin
    if TweenObjects.length<0 then
    begin
      for LItem in TweenObjects do
      begin
        LId := LItem.Id.Trim;
        if LId.length>0 then
        begin

          if self.IndexOf(LId)<0 then
          FValues.add(LItem) else
          Raise EW3Exception.CreateFmt
          ('Execute failed, a tween-object with id [%s] already exists in collection error',[LId]);
        end else
        Raise EW3Exception.Create
        ('Execute failed, could not inject tween object, element missing qualified id error');
      end;
    end;

    Execute;

  end else
  raise exception.Create('Tween already executing error');
end;

procedure TW3Tween.Execute(Finished:TProcedureRef);
begin
  self.OnFinished := procedure (sender:Tobject)
    begin
      if assigned(Finished) then
      Finished;
    end;
  Execute;
end;

procedure TW3Tween.Execute;
begin
  if not Active then
  begin

    FPartial := false;

    case SyncRefresh of
    true:
      begin
        // Initiate loop in 100ms
        W3_Callback( procedure ()
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
  raise exception.Create('Tween already executing error');
end;

procedure TW3Tween.Delete(const TweenIds:Array of String);
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
        FValues.delete(LIndex,1);
        LObj.free;
      end;
    end;
  end;
end;

Procedure TW3Tween.Resume(const index:Integer);
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
        FValues[index].StartTime := GetTimeCode;
        FValues[Index].State := tsRunning;
      end;
    end;
  end;
end;

procedure TW3Tween.Resume(const Tween:TTweenElement);
begin
  if Active then
  Begin
    if Tween<>NIL then
    Begin
      if FValues.IndexOf(Tween)>=0 then
      begin
        if Tween.state=tsPaused then
        begin
          Tween.StartTime := GetTimeCode;
          Tween.State := tsPaused;
        end;
      end;
    end;
  end;
end;

procedure TW3Tween.Resume(const Objs:Array of TTweenElement);
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
        Resume(LObj);
      end;
    end;
  end;
end;

procedure TW3Tween.Resume(const Ids:Array of String);
var
  LId:  String;
begin
  if Active then
  begin
    for LId in Ids do
    begin
      Resume(ObjectOf(Lid));
    end;
  end;
end;

procedure TW3Tween.Resume;
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
        Resume(LObj);
      end;
    end;
  end;
end;

Procedure TW3Tween.Pause(const Index:Integer);
var
  LObj: TTweenElement;
begin
  if Active then
  begin
    if (Index>=0) and (Index<FValues.Count) then
    begin
      LObj := FValues[index];
      if LObj.State=tsRunning then
      FValues[Index].State := tsPaused;
    end;
  end;
end;

procedure TW3Tween.Pause(const Tween:TTweenElement);
begin
  if Active then
  Begin
    if Tween<>NIL then
    Begin
      if FValues.IndexOf(Tween)>=0 then
      begin
        if Tween.state=tsRunning then
        Tween.State := tsPaused;
      end;
    end;
  end;
end;

procedure TW3Tween.Pause(const Objs:Array of TTweenElement);
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
        Pause(LObj);
      end;
    end;
  end;
end;

procedure TW3Tween.Pause(const Ids:Array of String);
var
  LId:  String;
begin
  if Active then
  begin
    for LId in Ids do
    begin
      Pause(ObjectOf(Lid));
    end;
  end;
end;

procedure TW3Tween.Pause;
var
  LObj: TTweenElement;
begin
  if Active then
  begin
    if FValues.length>0 then
    Begin
      for LObj in FValues do
      begin
        Pause(LObj);
      end;
    end;
  end;
end;

procedure TW3Tween.Cancel;
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

Procedure TW3Tween.Delete(index:Integer);
var
  LObj: TTweenElement;
begin
  LObj:=FValues[index];
  FValues.Delete(Index,1);
  LObj.free;
end;

procedure TW3Tween.Delete(Id:String);
begin
  Delete(FValues.indexOf(ObjectOf(Id)));
end;

function TW3Tween.Add(Id:String):TTweenElement;
begin
  Id := id.trim.lowercase;
  if id.length>0 then
  begin
    if IndexOf(Id)<0 then
    begin
      result := TTweenElement.Create;
      result.Id := Id;
      FValues.add(result);
    end else
    raise EW3Exception.CreateFmt
    ('A tween-object with id [%s] already exists in collection error',[Id]);
  end else
  raise EW3Exception.Create('Invalid tween-object id [empty] error');
end;

Function TW3Tween.Add(Id:String;const aStartValue,aDistance,aDuration:float;
          const aAnimationType:TW3TweenAnimationType;
          const aBehavior:TTweenBehavior):TTweenElement;
begin
  Id := id.trim.lowercase;
  if id.length>0 then
  begin
    if IndexOf(Id)<0 then
    begin
      result := TTweenElement.Create;
      result.StartValue := aStartValue;
      result.Distance := aDistance;
      result.Duration := aDuration;
      result.AnimationType := aAnimationtype;
      result.Behavior := aBehavior;
      result.StartTime := GetTimeCode;
      result.Id := Id;
      FValues.add(result);
    end else
    raise EW3Exception.CreateFmt
    ('A tween-object with id [%s] already exists in collection error',[Id]);
  end else
  raise EW3Exception.Create('Invalid tween-object id [empty] error');
end;

function TW3Tween.IndexOf(Id:String):Integer;
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

function TW3Tween.ObjectOf(const Id:String):TTweenElement;
var
  LIndex: Integer;
begin
  LIndex := IndexOf(Id);
  if LIndex>=0 then
  result := FValues[LIndex] else
  result := NIL;
end;

//############################################################################
// TTweenData
//############################################################################

function TTweenData.Expired: Boolean;
begin
  result := StartTime + Duration < GetTimeCode;
end;

Procedure TTweenData.Reset;
begin
  StartTime := 0;
  StartValue := 0;
  Distance := 0;
  Duration := 0;
  Animationtype := ttlinear;
  Behavior := tbSingle;
end;

//############################################################################
// TTweenElement
//############################################################################

Constructor TTweenElement.Create;
begin
  inherited Create;
  State := tsIdle;
end;

Procedure TTweenElement.Reset;
begin
  inherited Reset;
  State := tsIdle;
end;

procedure TTweenElement.Update(const aValue:Float);
begin
  Value := aValue;
  if assigned(OnUpdated) then
  OnUpdated(self);
end;

//#############################################################################
//  TW3TweenEase
//#############################################################################
{$HINTS OFF}
class function TW3TweenEase.QuartIn(t, b, c, d:float):float;
begin
  asm
    @t /= @d;
    return @c * @t * @t * @t * @t + @b;
  end;
end;

class function TW3TweenEase.QuartOut(t, b, c, d:float):float;
begin
  asm
    @t /= @d;
    @t--;
    return -@c * (@t * @t * @t * @t - 1) + @b;
  end;
end;

class function TW3TweenEase.QuartInOut(t, b, c, d:float):float;
begin
  asm
    @t /= @d/2;
    if (@t < 1) {
        return @c / 2 * @t * @t * @t * @t + @b;
    }
    @t -= 2;
    return -@c / 2 * (@t * @t * @t * @t - 2) + @b;
  end;
end;

class function TW3TweenEase.CubeInOut(t, b, c, d:float):float;
begin
  asm
    @t /= @d/2;
    if (@t < 1) {
      return @c / 2 * @t * @t * @t + @b;
    }
    @t -= 2;
    return @c/2 * (@t * @t * @t + 2) + @b;
  end;
end;

class function TW3TweenEase.CubeOut(t, b, c, d:float):float;
begin
  asm
    @t /= @d;
    @t--;
    return @c * (@t * @t * @t + 1) + @b;
  end;
end;

class function TW3TweenEase.CubeIn(t, b, c, d:float):float;
begin
  asm
    @t /= @d;
    return @c * @t * @t * @t + @b;
  end;
end;

class function TW3TweenEase.QuadInOut(t, b, c, d:float):float;
begin
  asm
    @t /= @d/2;
    if (@t < 1) {
      return @c / 2 * @t * @t * @t + @b;
    }
    @t -= 2;
    @result = @c/2*(@t * @t * @t + 2) + @b;
  end;
end;

class function TW3TweenEase.QuadOut(t, b, c, d:float):float;
begin
  asm
    @t /= @d;
    return -@c * @t * (@t - 2) + @b;
  end;
end;

class function TW3TweenEase.QuadIn(t, b, c, d:float):float;
begin
  asm
    @t /= @d;
    return @c * @t * @t + @b;
  end;
end;

class function TW3TweenEase.Linear(t,b,c,d:float):float;
begin
  asm
   @result = @c * @t / @d + @b;
  end;
end;
{$HINTS ON}
end.

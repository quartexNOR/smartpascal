unit swipecontroller;

interface

uses 
  system.types,
  system.dateutils,
  SmartCL.System,
  SmartCL.Components;

type

  TSwipeControllerDirection = (
    sdNone=0,
    sdLeft,
    sdRight,
    sdDown,
    sdUp
    );

  TSwipeControllerEvent = Procedure (sender:TObject;
    const Direction:TSwipeControllerDirection);

  TSwipeControllerInfo = class
  public
    begins: TDateTime;
    sX: Integer;
    sY: Integer;
    eX: Integer;
    eY: Integer;
  end;

  TSwipeRange = class
  private
    FMin: Integer;
    FMax: Integer;
  protected
    procedure SetMin(Value:Integer);virtual;
    procedure SetMax(Value:Integer);virtual;
  public
    property  Minimum:Integer read FMin write SetMin;
    property  Maximum:Integer read FMax write SetMax;
    constructor Create(AMin,AMax:Integer);
  end;

  TSwipeController = class(TObject)
  private
    FAttached:  Boolean;
    FControl:   TW3TagObj;
    FHRange:    TSwipeRange;
    FVRange:    TSwipeRange;
    FInfo:      TSwipeControllerInfo;
    FDirection: TSwipeControllerDirection;
  protected
    FTouchHandleStart:  THandle;
    FTouchHandleMove:   THandle;
    FTouchHandleUp:     THandle;
    procedure SetupGestures;
    procedure RemoveGestures;
  public
    Property    Latency:Integer;
    property    HRange:TSwipeRange read FHRange;
    property    VRange:TSwipeRange read FVRange;
    Property    Owner:TW3TagObj read FControl;
    property    Attached:Boolean read FAttached;
    Property    OnSwipe:TSwipeControllerEvent;

    procedure   Attach(const AOwner:TW3TagObj);
    procedure   Detach;
    constructor Create(const AOwner:TW3TagObj);virtual;
    destructor  Destroy;Override;
  end;


implementation


//############################################################################
// TSwipeRange
//############################################################################

constructor TSwipeRange.Create(AMin,AMax:Integer);
begin
  inherited Create;
  FMin:=AMin;
  FMax:=AMax;
end;

procedure TSwipeRange.SetMin(Value:Integer);
begin
  FMin := TInteger.EnsureRange(Value,10,1000);
end;

procedure TSwipeRange.SetMax(Value:Integer);
begin
  FMax := TInteger.EnsureRange(Value,10,1000);
end;

//############################################################################
// TSwipeController
//############################################################################

constructor TSwipeController.Create(const AOwner:TW3TagObj);
begin
  inherited Create;
  FHRange:=TSwipeRange.Create(20,40); // [min]---X---[max]
  FVRange:=TSwipeRange.Create(20,40); // [min]---Y---[max]
  FInfo := TSwipeControllerInfo.Create;
  Latency := 35;

  if assigned(AOwner) then
    Attach(Aowner);
end;

destructor TSwipeController.Destroy;
begin
  if FAttached then
  Detach;
  FHRange.free;
  FVRange.free;
  FInfo.free;
  inherited;
end;

procedure TSwipeController.Attach(const AOwner:TW3TagObj);
begin
  if FAttached then
  Detach;

  if AOwner<>NIl then
  begin
    FControl := AOwner;
    FAttached := true;
    FControl.Handle.readyExecute( procedure ()
      begin
        SetupGestures;
      end);
  end;
end;

procedure TSwipeController.Detach;
begin
  if FAttached then
  begin
    try
      RemoveGestures;
    finally
      FAttached := false;
    end;
  end;
end;

procedure TSwipeController.RemoveGestures;
begin
  FControl.Handle.removeEventListener(FTouchHandleStart);
  FControl.Handle.removeEventListener(FTouchHandleMove);
  FControl.Handle.removeEventListener(FTouchHandleUp);
  FTouchHandleStart := unassigned;
  FTouchHandleMove := unassigned;
  FTouchHandleUp := unassigned;
end;

procedure TSwipeController.SetupGestures;
begin
  FTouchHandleStart:=FControl.Handle.addEventListener
    ('touchstart', procedure (e:variant)
    begin
      e.preventDefault;
      var t := e.touches[0];
      FInfo.sx:=t.screenX;
      FInfo.sy:=t.screenY;
    end);

  FTouchHandleMove:=FControl.Handle.addEventListener
    ('touchmove', procedure (e:variant)
    begin
      e.preventDefault;
      if (e.touches) then
      Begin
        if e.touches.length>0 then
        begin
          var t := e.touches[0];
          FInfo.eX:=t.screenX;
          FInfo.eY:=t.screenY;
          FInfo.begins:=now;
        end;
      end;
    end);

  FTouchHandleUp:=FControl.Handle.addEventListener
    ('touchend', procedure (e:variant)
    var
      mTicks: Integer;
    begin
      e.preventDefault;
      FDirection:=sdNone;

      (* How many Ms since touch and release? *)
      mTicks:=MillisecondsBetween(FInfo.begins,now);

      if (mTicks <= Latency) then
      begin
        if (FInfo.ex - FHRange.Minimum > FInfo.sx)
        or (FInfo.ex + FHRange.Minimum < FInfo.sx) then
        begin
          if (FInfo.ey < (FInfo.sy + FVRange.Maximum))
          and (FInfo.sy > (FInfo.ey - FVRange.Maximum)) then
          begin
            if (FInfo.ex >  FInfo.sx) then
            FDirection:=sdRight else
            FDirection:=sdLeft;
          end;
        end;

        if ((FInfo.ey - FVRange.Minimum) > FInfo.sy)
        or ((FInfo.ey + FVRange.Minimum) < FInfo.sY) then
        begin
          if  (FInfo.ex < (FInfo.sx + FHRange.Maximum))
          and (FInfo.sx > (FInfo.ex - FHRange.Maximum)) then
          begin
            if FInfo.ey > FInfo.sY then
            FDirection :=sdDown else
            FDirection :=sdUp;
          end;
        end;

        if assigned(OnSwipe) then
        begin
          if FDirection<>sdNone then
          OnSwipe(self,FDirection);
        end;
      end;
    end);
end;

end.

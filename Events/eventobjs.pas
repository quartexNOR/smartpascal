unit eventobjs;

interface

uses 
  w3c.dom,
  SmartCL.Components,
  SmartCL.System;

type


  TEventObjTriggeredEvent = procedure (sender:TObject;EventObj:JEvent);

  TEventObj = class(TObject)
  private
    FOwner:     TW3TagObj;
    FAttached:  Boolean;
    FEventName: String;
  protected
    procedure   HandleEvent(eobj:variant);virtual;
  public
    Property    Attached:Boolean read FAttached;
    procedure   Attach(EventName:String);
    procedure   Detach;
    constructor Create(AOwner:TW3TagObj);virtual;
    destructor  Destroy;Override;
  public
    Property    EventName:String read FEventName;
    Property    Owner:TW3TagObj read FOwner;
    Property    OnEvent: TEventObjTriggeredEvent;
  end;

  TFixedEventObj = class(TObject)
  protected
    FAttached:  Boolean;
    FOwner:     TW3TagObj;
    procedure   HandleEvent(eobj:variant);virtual;
  protected
    function    DoGetEventName:String;virtual;abstract;
  public
    Property    Attached:Boolean read FAttached;
    procedure   Attach;
    procedure   Detach;
    constructor Create(AOwner:TW3TagObj);virtual;
    destructor  Destroy;override;
  public
    Property    Owner:TW3TagObj read FOwner;
    Property    OnEvent: TEventObjTriggeredEvent;
  end;

  TElementRemovedEvent = class(TFixedEventObj)
  protected
    function  DoGetEventName:String;override;
  end;

  TElementAddedEvent = class(TFixedEventObj)
  protected
    function  DoGetEventName:String;override;
  end;

implementation


//#############################################################################
// TElementAddedEvent
//#############################################################################

function TElementAddedEvent.DoGetEventName:String;
begin
  result := "DOMNodeInserted";
end;

//#############################################################################
// TElementRemovedEvent
//#############################################################################

function TElementRemovedEvent.DoGetEventName:String;
begin
  result := "DOMNodeRemoved";
end;

//#############################################################################
// TFixedEventObj
//#############################################################################

constructor TFixedEventObj.Create(AOwner:TW3TagObj);
begin
  inherited Create;
  FOwner:=AOwner;
  Attach;
end;

destructor TFixedEventObj.Destroy;
begin
  Detach;
  inherited;
end;

procedure TFixedEventObj.Attach;
begin
  if FAttached then
  Detach;
  FOwner.Handle.addEventListener(DoGetEventName,@HandleEvent,true);
  FAttached := true;
end;

procedure TFixedEventObj.Detach;
begin
  if FAttached then
  begin
    FOwner.Handle.removeEventListener(DoGetEventName,@HandleEvent,true);
    FAttached := false;
  end;
end;

procedure TFixedEventObj.HandleEvent(eObj:variant);
begin
  if assigned(OnEvent) then
  OnEvent(self, JEvent(eObj));
end;

//#############################################################################
// TEventObj
//#############################################################################

constructor TEventObj.Create(AOwner:TW3TagObj);
begin
  inherited Create;
  FOwner := AOwner;
end;

destructor TEventObj.Destroy;
begin
  if FAttached then
  Detach;
  inherited;
end;

procedure TEventObj.HandleEvent(eobj:variant);
begin
  if assigned(OnEvent) then
  OnEvent(self,JEvent(eObj));
end;

procedure TEventObj.Attach(EventName:String);
begin
  if FAttached then
  Detach;

  FEventName := EventName;
  try
    FOwner.handle.addEventListener(FEventName,@HandleEvent,true);
  except
    FEventname:= '';
    FAttached:=false;
    exit;
  end;
  FAttached:=true;
end;

procedure TEventObj.Detach;
begin
  if FAttached then
  begin
    try
      FOwner.handle.removeEventListener(FEventName,@HandleEvent,true);
    finally
      FEventName := '';
      FAttached := false;
    end;
  end;
end;



end.

unit wb.messages;

interface

uses
  w3c.dom,
  System.Types, System.Time, System.JSon,
  SmartCL.System;

const
  CNT_QTX_MESSAGES_BASEID = 1000;

type

  TWbMessageData       = Class;
  TWbCustomMsgPort     = Class;
  TWbOwnedMsgPort      = Class;
  TWbMsgPort           = Class;
  TWbMainMessagePort   = Class;
  TWbMessageSubscription = Class;

  TWbMessageSubCallback  = procedure (Message: TWbMessageData);
  TWbMsgPortMessageEvent = procedure  (sender: TObject; EventObj: JMessageEvent);
  TWbMsgPortErrorEvent   = procedure  (sender: TObject; EventObj: JDOMError);

  (* The TWbMessageData represents the actual message-data which is sent
     internally by the system. Unlike Delphi or FPC, it is a class rather
     than a record. Also, it does not derive from TObject - and as such
     is suitable for 1:1 JSON mapping.

     Note:  The Source string is special, as it's demanded by the browser to
            send the URL which is the source of whatever document the message
            is targeting. You can send messages between open windows in
            modern browser -- but we dont implement that (yet) since SMS is
            all about single-page, rich content applications.
            Either way, the source must either contain the current document
            URL -- or alternatively "*" which means "any". By default we
            set this value, so you really dont have to know about that

     Note:  You dont need to free TWbMessageData objects, Javascript is
            garbage-collected. *)
  TWbMessageData = class(JObject)
  public
    property    ID: Integer;
    property    Source: String;
    property    Data: String;

    function    Deserialize:String;
    procedure   Serialize(const value:String);

    constructor Create;
  end;


  (* A mesaage port is a wrapper around the DOM->Window[]->OnMessage
     event and DOM->Window[]->PostMessage API.
     This base-class implements the generic behavior we want from this
     class. We later derive new variations from it *)
  TWbCustomMsgPort = Class(TObject)
  private
    FWindow:    THandle;
  protected
    procedure   Releasewindow;virtual;
    procedure   HandleMessageReceived(const EventObj: JMessageEvent);
    procedure   HandleError(const EventObj: JDOMError);

  public
    property    Handle:THandle read FWindow;
    procedure   PostMessage(Msg: variant; TargetOrigin: string);virtual;
    procedure   BroadcastMessage(Msg: variant; TargetOrigin: string);virtual;

    constructor Create(WND: THandle);virtual;
    destructor  Destroy;Override;
  published
    property    OnMessageReceived: TWbMsgPortMessageEvent;
    property    OnError: TWbMsgPortErrorEvent;
  end;

  (* This type of message-port is designed to be used with an already
     visible browser window. The base-class accepts a window-handle in
     it's constructor, so you can just feed it a DOM Window or frame *)
  TWbOwnedMsgPort = class(TWbCustomMsgPort)
  end;

  (* This message-port type is very different from both the
     ad-hoc baseclass and "owned" variation above.
     This one actually creates it's own IFrame instance, which
     means it's a completely stand-alone entity which doesnt need an
     existing window to dispatch and handle messages *)
  TWbMsgPort = Class(TWbCustomMsgPort)
  private
    FFrame:     THandle;
    function    AllocIFrame: THandle;
    procedure   ReleaseIFrame(aHandle: THandle);
  protected
    procedure   ReleaseWindow; override;
  public
    Constructor Create; reintroduce; virtual;
  end;

  (* This message port represent the "main" message port for any
     application that includes this unit. It will connect to the main
     window (deriving from the "owned" base class) and has a custom
     message-handler which dispatches messages to any subscribers *)
  TWbMainMessagePort = Class(TWbOwnedMsgPort)
  protected
    procedure   HandleMessage(Sender:TObject;EventObj:JMessageEvent);
  public
    constructor Create(WND: THandle);override;
  end;

  (* Information about registered subscriptions *)
  TWbSubscriptionInfo = record
    MSGID:    Integer;
    Callback: TWbMessageSubCallback;
  end;

  (* A message subscription is an object that allows you to install
     X number of event-handlers for messages you want to recieve. Its
     important to note that all subscribers to a message will get the
     same message -- there is no blocking or ownership concepts
     involved. This system is a huge improvement over the older WinAPI *)
  TWbMessageSubscription = Class(TObject)
  private
    FObjects:   Array of TWbSubscriptionInfo;
  public
    function    SubscribesToMessage(MSGID:Integer):Boolean;
    procedure   Dispatch(const Message:TWbMessageData);virtual;

    function    Subscribe(MSGID:Integer;
                const Callback:TWbMessageSubCallback):THandle;

    procedure   Unsubscribe(Handle:THandle);
    Constructor Create;virtual;
    Destructor  Destroy;Override;
  end;

  (* Helper functions which simplify message handling *)
  function  WB_MakeMsgData: TWbMessageData;
  procedure WB_PostMessage(const msgValue:TWbMessageData);
  procedure WB_BroadcastMessage(const msgValue:TWbMessageData);

  (* Audience returns true if a message-ID have any
     subscriptions assigned to it *)
  function  WB_Audience(msgId: Integer): boolean;

  // Returns the global application message-port
  function WB_GetAppMsgPort: TWbMainMessagePort;

implementation

uses SmartCL.System;

var
_mainport:    TWbMainMessagePort = NIL;
_subscribers: Array of TWbMessageSubscription;

//#############################################################################
//
//#############################################################################

function WB_GetAppMsgPort: TWbMainMessagePort;
begin
  if _mainport = NIL then
  begin
    _mainport := TWbMainMessagePort.Create(BrowserAPI.Window);
  end;
  result:=_mainport;
end;

procedure WBDefaultMessageHandler(sender: TObject; EventObj: JMessageEvent);
var
  x:      Integer;
  mItem:  TWbMessageSubscription;
  mData:  TWbMessageData;
begin
  mData := new TWbMessageData();
  mData.Serialize(EventObj.Data);

  for x:=0 to _subscribers.count-1 do
  Begin
    mItem:=_subscribers[x];
    if mItem.SubscribesToMessage(mData.ID) then
    Begin
      (* We execute with a minor delay, allowing the browser to
         exit the function before we dispatch our data *)
      TW3Dispatch.Execute(procedure ()
        begin
          mItem.Dispatch(mData);
        end, 8);
    end;
  end;
end;

function  WB_MakeMsgData: TWbMessageData;
begin
  result := new TWbMessageData();
  result.Source := "*";
end;

procedure WB_PostMessage(const msgValue: TWbMessageData);
begin
  if msgValue<>NIL then
  WB_GetAppMsgPort().PostMessage(msgValue.Deserialize,msgValue.Source) else
  raise exception.create('Postmessage failed, message object was NIL error');
end;

procedure WB_BroadcastMessage(const msgValue: TWbMessageData);
Begin
  if msgValue<>NIL then
  WB_GetAppMsgPort().BroadcastMessage(msgValue,msgValue.Source) else
  raise exception.create('Broadcastmessage failed, message object was NIL error');
end;

function  WB_Audience(msgId:Integer): boolean;
var
  x:  Integer;
  mItem:  TWbMessageSubscription;
begin
  result:=False;
  for x:=0 to _subscribers.count-1 do
  Begin
    mItem:=_subscribers[x];
    result:=mItem.SubscribesToMessage(msgId);
    if result then
    break;
  end;
end;

//#############################################################################
// TWbMainMessagePort
//#############################################################################

Constructor TWbMessageData.Create;
begin
  self.Source:="*";
end;

function  TWbMessageData.Deserialize:String;
begin
  result:=JSON.Stringify(self);
end;

procedure TWbMessageData.Serialize(const value:String);
var
  mTemp:  variant;
Begin
  mTemp := JSON.Parse(value);
  self.id := TWbMessageData(mTemp).ID;
  self.source:= TWbMessageData(mTemp).source;
  self.data:=TWbMessageData(mTemp).data;
end;

//#############################################################################
// TWbMainMessagePort
//#############################################################################

Constructor TWbMainMessagePort.Create(WND: THandle);
begin
  inherited Create(WND);
  OnMessageReceived := WBDefaultMessageHandler;
end;

procedure TWbMainMessagePort.HandleMessage(Sender:TObject;
          EventObj:JMessageEvent);
begin
  WBDefaultMessageHandler(self, eventObj);
end;

//#############################################################################
// TWbMessageSubscription
//#############################################################################

Constructor TWbMessageSubscription.Create;
begin
  inherited Create;
  _subscribers.add(self);
end;

Destructor TWbMessageSubscription.Destroy;
Begin
  _subscribers.Remove(self);
  inherited;
end;

function TWbMessageSubscription.SubScribe(MSGID:Integer;
         const Callback:TWbMessageSubCallback):THandle;
var
  mObj: TWbSubscriptionInfo;
begin
  mObj.MSGID:=MSGID;
  mObj.Callback:=@Callback;
  FObjects.add(mObj);
  result:=mObj;
end;

procedure TWbMessageSubscription.Unsubscribe(Handle:THandle);
var
  x:  Integer;
begin
  for x:=0 to FObjects.Count-1 do
  Begin
    if Variant(FObjects[x]) = Handle then
    Begin
      FObjects.delete(x,1);
      break;
    end;
  end;
end;

function TWbMessageSubscription.SubscribesToMessage(MSGID:Integer):Boolean;
var
  x:  Integer;
begin
  result:=False;
  for x:=0 to FObjects.Count-1 do
  Begin
    if FObjects[x].MSGID = MSGID then
    Begin
      result:=true;
      break;
    end;
  end;
end;

procedure TWbMessageSubscription.Dispatch(const Message: TWbMessageData);
var
  x:  Integer;
begin
  for x:=0 to FObjects.Count-1 do
  Begin
    if FObjects[x].MSGID = Message.ID then
    Begin
      if assigned(FObjects[x].Callback) then
      FObjects[x].Callback(Message);
      break;
    end;
  end;
end;

//#############################################################################
// TWbMsgPort
//#############################################################################

constructor TWbMsgPort.Create;
begin
  FFrame := allocIFrame;
  if (FFrame) then
    inherited Create(FFrame.contentWindow) else
  raise Exception.Create('Failed to create message-port error');
end;

procedure TWbMsgPort.ReleaseWindow;
Begin
  ReleaseIFrame(FFrame);
  FFrame:=unassigned;
  Inherited;
end;

Procedure TWbMsgPort.ReleaseIFrame(aHandle:THandle);
begin
  If (aHandle) then
  Begin
    asm
      document.body.removeChild(@aHandle);
    end;
  end;
end;

function TWbMsgPort.AllocIFrame:THandle;
Begin
  asm
    @result = document.createElement('iframe');
  end;

  if (result) then
  begin
    /* if no style property is created, we provide that */
    if not (result['style']) then
    result['style']:=TVariant.createObject;

    /* Set visible style to hidden */
    result['style'].display := 'none';

    asm
      document.body.appendChild(@result);
    end;

  end;
end;

//#############################################################################
// TWbCustomMsgPort
//#############################################################################

constructor TWbCustomMsgPort.Create(WND: THandle);
Begin
  inherited Create;
  FWindow := WND;
  if (FWindow) then
  Begin
    FWindow.addEventListener('message', @HandleMessageReceived, false);
    FWindow.addEventListener('error', @HandleError, false);
  end;
End;

destructor TWbCustomMsgPort.Destroy;
begin
  if (FWindow) then
  Begin
    FWindow.removeEventListener('message', @HandleMessageReceived, false);
    FWindow.removeEventListener('error', @HandleError, false);
    ReleaseWindow;
  end;
  inherited;
end;

procedure TWbCustomMsgPort.HandleMessageReceived(const EventObj: JMessageEvent);
Begin
  if assigned(OnMessageReceived) then
    OnMessageReceived(self,eventObj);
End;

procedure TWbCustomMsgPort.HandleError(const EventObj: JDOMError);
Begin
  if assigned(OnError) then
    OnError(self,eventObj);
end;

procedure TWbCustomMsgPort.Releasewindow;
begin
  FWindow := Unassigned;
end;

Procedure TWbCustomMsgPort.PostMessage(msg: Variant; targetOrigin: string);
begin
  if (FWindow) then
    FWindow.postMessage(msg,targetOrigin);
end;

procedure TWbCustomMsgPort.BroadcastMessage(msg: Variant; targetOrigin: string);
var
  x:  Integer;
  mLen: Integer;
begin
  mLen:=TVariant.AsInteger(browserAPI.Window.frames.length);
  for x:=0 to mLen-1 do
  begin
    browserAPI.window.frames[x].postMessage(msg,targetOrigin);
  end;
end;

finalization
begin
  if assigned(_mainport) then
  _mainport.free;
end;

end.

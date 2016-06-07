unit qtxcomponent;

interface

uses 
  W3System;

type

  (* Exception classes *)
  EQTXException       = Class(Exception);
  EQTXNotImplemented  = Class(EQTXException);
  TQTXExceptionClass  = Class of EQTXException;

  (* Forward declarations *)
  TQTXErrorObject   = Class;
  TQTXPersistent    = Class;
  TQTXComponent     = Class;
  TQTXHtmlElement   = Class;
  TQTXDelegate      = Class;
  TQTXControl       = Class;

  (* Standard datatype mapping *)
  TDateTime = Float;
  Real      = Float;
  Double    = Float;
  Extended  = Float;
  TColor    = Integer;
  THandle   = Variant;


  IQTXError = Interface
    // function  getUseException:Boolean;
    // procedure setUseException(aValue:Boolean);
    procedure setLastError(aValue:String);
    function  getLastError:String;
    function  getExceptionType:TQTXExceptionClass;
    procedure clearLastError;
  end;

  IQTXPersistent = interface
    function  queryID: String;
    function  queryContent:Boolean;
    function  readContent:String;
    procedure writeContent(aData:String);
  end;

  IQTXComponent = interface
    function  getChildCount:Integer;
    function  getChild(index:Integer):TQTXComponent;
    function  insertChild(const aInstance:TQTXComponent):Integer;
    procedure removeChild(const aInstance:TQTXComponent);
    Function  indexOf(const aInstance:TQTXComponent):Integer;
    function  objectOf(aName:String):TQTXComponent;
  end;

  IQTXAttributeAccess = interface
    function  getAttribute(aName:String):variant;
    procedure setAttribute(aName:String;aValue:Variant);
  end;

  IQTXHtmlElement = interface
    function  queryAttached:Boolean;
    function  getElementType:String;
    procedure makeHandle;
    procedure destroyHandle;
    procedure attachTo(const aParent:TQTXHtmlElement);
    Procedure detachFrom;
  end;

  IQTXParentContainer = interface
    Procedure  childInserted(aChild:TQTXHtmlElement);
    Procedure  childRemoved(aChild:TQTXHtmlElement);
  end;

  TQTXErrorObject = Class(TObject,IQTXError)
  private
    FLastError:   String;
    FUseException:Boolean;
  protected
    (* IMPLEMENTS:: IQTXError *)
    procedure setLastError(aValue:String);
    function  getUseException:Boolean;
    procedure setUseException(aValue:Boolean);
    function  getLastError:String;
    function  getExceptionType:TQTXExceptionClass;
    procedure clearLastError;

    (* Aux formated variation of setLastError *)
    procedure setLastErrorF(aValue:String;
              const aItems:Array of const);

    Property  UseException:Boolean read getUseException
              write setUseException;
  End;


  TQTXPersistent = Class(TQTXErrorObject,IQTXPersistent)
  protected
    (* IMPLEMENTS:: IQTXPersistent *)
    function  QueryID: String;
    function  QueryContent:Boolean;
    function  ReadContent:String;
    procedure WriteContent(aData:String);
  public
    Procedure Assign(aSource:TQTXPersistent);overload;
    Procedure Assign(aSource:IQTXPersistent);overload;
  end;

  TQTXHtmlElement = Class(TQTXPersistent,IQTXHtmlElement,IQTXAttributeAccess)
  private
    FHandle:  THandle;
    FParent:  TQTXHtmlElement;
  protected
    (* IMPLEMENTS:: IQTXHtmlElement *)
    function  queryAttached:Boolean;virtual;
    function  getElementType:String;virtual;
    procedure makeHandle;virtual;
    procedure destroyHandle;virtual;
    procedure AttachTo(const aParent:TQTXHtmlElement);
    Procedure DetachFrom;

    (* IMPLEMENTS:: IQTXAttributeAccess *)
    function  getAttribute(aName:String):variant;
    procedure setAttribute(aName:String;aValue:Variant);

  protected
    Procedure AfterCreateHandle;virtual;
    Procedure BeforeDestroyHandle;virtual;
  public
    Property  Handle:THandle read FHandle;
    property  Parent:TQTXHtmlElement read FParent;
  end;

  TQTXComponentState = set of (csCreating,csLoading,csDestroying);

  TQTXComponent = Class(TQTXPersistent,IQTXParentContainer)
  private
    FChildren:  Array of TQTXHtmlElement;
    FState:     TQTXComponentState;
    FParent:    TQTXComponent;
  protected
    Procedure   ChildInserted(aChild:TQTXHtmlElement);
    Procedure   ChildRemoved(aChild:TQTXHtmlElement);

    function    getChildCount:Integer;
    function    getChild(index:Integer):TQTXHtmlElement;
  public
    Property    ComponentState: TQTXComponentState read FState;
    Property    Parent:TQTXComponent read FParent;

    Constructor Create(AOwner:TQTXComponent);virtual;
    Destructor  Destroy;Override;
  end;

  TQTXDelegateHandler = procedure (eventObj:TQTXDelegate);

  TQTXDelegate = Class(TQTXPersistent)
  private
    FName:    String;
    FParent:  TQTXControl;
    FHandler: TQTXDelegateHandler;
  protected
    procedure Dispatch;
  public
    Property  Parent:TQTXControl read FParent;
    Property  EventName:String read FName;

    Property  OnExecute:TQTXDelegateHandler
              read FHandler write FHandler;

    Constructor Create(AOwner:TQTXControl);virtual;
  end;

  TQTXDelegates = Class(TQTXPersistent)
  private
    FParent:    TQTXControl;
    FDelegates: Array of TQTXDelegate;
  public
    Property    Count:Integer read ( FDelegates.Count );
    Property    Item[index:Integer]:TQTXDelegate
                read ( FDelegates[index] );
    function    Add:TQTXDelegate;virtual;
    Constructor Create(AOwner:TQTXControl);
    Destructor  Destroy;Override;
  end;

  TQTXControl = Class(TQTXComponent)
  private
    FDelegates: TQTXDelegates;
  protected

  protected
    procedure   Resize;virtual;
    Procedure   Paint;virtual;
  public
    Property    Delegates:TQTXDelegates read FDelegates;

    Property    Child[index:Integer]:TQTXHtmlElement
                read  ( getChild(index) );
    Property    ChildCount:Integer read getChildCount;

    Procedure   Invalidate;

    Constructor Create(AOwner:TQTXControl);override;
    Destructor  Destroy;Override;
  End;

implementation

const
CNT_QTX_NODATA  = '';

resourcestring
CNT_QTX_NOTIMPLEMENTED  = 'Method not implemented error';
CNT_QTX_FailedCreateElement = 'Failed to create HTML element: %s';

//############################################################################
// TQTXControl
//############################################################################

Constructor TQTXControl.Create(AOwner:TQTXControl);
Begin
  inherited Create(AOwner);
  FDelegates:=TQTXDelegates.Create(self);
end;

Destructor  TQTXControl.Destroy;
Begin
  FDelegates.free;
  inherited;
end;

Procedure TQTXControl.Invalidate;
Begin
  (* if not (csDestroying in ComponentState) then
  TQTXRuntime.delayedDispatch( procedure ()
    Begin
      Paint;
    end,
    50); *)
end;

procedure TQTXControl.Resize;
begin
end;

Procedure TQTXControl.Paint;
Begin
end;

//############################################################################
// TQTXDelegates
//############################################################################

Constructor TQTXDelegates.Create(AOwner:TQTXControl);
Begin
  inherited Create;
  FParent:=AOwner;
end;

Destructor TQTXDelegates.Destroy;
var
  x:  Integer;
Begin
  if FDelegates.Count>0 then
  begin
    for x:=FDelegates.low to FDelegates.high do
    FDelegates[x].free;
  end;
  inherited;
end;

function TQTXDelegates.Add:TQTXDelegate;
begin
  result:=TQTXDelegate.Create(FParent);
  FDelegates.add(result);
end;

//############################################################################
// TQTXDelegate
//############################################################################

Constructor TQTXDelegate.Create(AOwner:TQTXControl);
Begin
  inherited Create;
  FParent:=AOwner;
end;

procedure TQTXDelegate.Dispatch;
Begin
  if assigned(FHandler) then
  FHandler(self);
end;


//############################################################################
// TQTXComponent
//############################################################################

Constructor TQTXComponent.Create(AOwner:TQTXComponent);
Begin
  inherited Create;
  FParent:=AOwner;
end;

Destructor TQTXComponent.Destroy;
var
  x:  Integer;
Begin
  include(FState,csDestroying);

  if FChildren.Count>0 then
  begin
    try
      for x:=FChildren.low to FChildren.high do
      FChildren[x].free;
    finally
      FChildren.clear;
    end;
  end;

  inherited;
end;

Procedure TQTXComponent.ChildInserted(aChild:TQTXHtmlElement);
begin
  if assigned(aChild) then
  begin
    if FChildren.indexOf(aChild)<0 then
    begin
      FChildren.add(aChild);
    end;
  end;
end;

Procedure TQTXComponent.ChildRemoved(aChild:TQTXHtmlElement);
var
  mIndex: Integer;
begin
  if not (csDestroying in ComponentState) then
  Begin
    if assigned(aChild) then
   begin
      mIndex:=FChildren.indexOf(aChild);
      if mIndex>=0 then
      FChildren.delete(mIndex,1);
    end;
  end;
end;

function TQTXComponent.getChildCount:Integer;
begin
  result:=FChildren.Count;
end;

function TQTXComponent.getChild(index:Integer):TQTXHtmlElement;
begin
  result:=FChildren[index];
end;

//############################################################################
// TQTXHtmlElement
//############################################################################

function TQTXHtmlElement.getAttribute(aName:String):variant;
Begin
  result:=null;
end;

procedure TQTXHtmlElement.setAttribute(aName:String;aValue:Variant);
Begin
end;

function  TQTXHtmlElement.getElementType:String;
Begin
  result:='div';
end;

procedure TQTXHtmlElement.makeHandle;
var
  mRef: THandle;
  mObj: String;
begin
  try

    try
      mObj:=getElementType;
      asm
        @mRef = document.createElement(@mObj);
      end;
    except
      on e: exception do
      setLastErrorF(CNT_QTX_FailedCreateElement,[e.message]);
    end;

    FHandle:=mRef;
  finally
    AfterCreateHandle;
  end;
end;

procedure TQTXHtmlElement.destroyHandle;
begin
  if (FHandle) then
  begin
    try
      BeforeDestroyHandle;

      if queryAttached then
      DetachFrom;

      //if (FHandle.parentNode) then
      //FHandle.parentNode.removeChild(FHandle);
    finally
      FHandle:=null;
      FParent:=NIL;
    end;
  end;
end;

Procedure TQTXHtmlElement.AfterCreateHandle;
begin
end;

Procedure TQTXHtmlElement.BeforeDestroyHandle;
Begin
end;

function TQTXHtmlElement.queryAttached:Boolean;
Begin
  if (FHandle) then
  result:=(FHandle.parentNode);
end;

procedure TQTXHtmlElement.AttachTo(const aParent:TQTXHtmlElement);
var
  mAccess:  IQTXParentContainer;
begin
  if (FHandle) then
  Begin
    (* Detach if already attached to an element *)
    if (FHandle.parentNode) then
    detachFrom;

    (* set new parent object *)
    FParent:=aParent;

    (* attach to new parent handle *)
    if FParent<>NIl then
    FHandle.parentNode := aParent.Handle;

    mAccess:=(aParent as IQTXParentContainer);
    if mAccess<>NIL then
    mAccess.ChildInserted(self);

  end;
end;

Procedure TQTXHtmlElement.DetachFrom;
var
  mAccess:  IQTXParentContainer;
Begin
  if (FHandle) then
  Begin
    if (FHandle.parentNode) then
    FHandle.parentNode.removeChild(FHandle);

    if assigned(FParent) then
    begin
      mAccess:=(FParent as IQTXParentContainer);
      if mAccess<>NIL then
      mAccess.ChildRemoved(self);
    end;

    FParent:=NIL;
  end;
end;

//############################################################################
// TQTXPersistent
//############################################################################

Procedure TQTXPersistent.Assign(aSource:TQTXPersistent);
Begin
  if assigned(aSource) then
  Begin
    if aSource.QueryContent then
    WriteContent(aSource.ReadContent) else
    WriteContent(CNT_QTX_NODATA);
  end else
  WriteContent(CNT_QTX_NODATA);
end;

Procedure TQTXPersistent.Assign(aSource:IQTXPersistent);
Begin
  if assigned(aSource) then
  begin
    if aSource.QueryContent then
    writeContent(aSource.ReadContent) else
    writeContent(CNT_QTX_NODATA);
  end else
  WriteContent(CNT_QTX_NODATA);
end;

function TQTXPersistent.QueryID:String;
Begin
  result:=className;
end;

function TQTXPersistent.QueryContent:Boolean;
begin
  result:=False;
end;

function TQTXPersistent.ReadContent:String;
begin
  result:=CNT_QTX_NODATA;
  setLastError(CNT_QTX_NOTIMPLEMENTED);
end;

procedure TQTXPersistent.WriteContent(aData:String);
begin
end;

//############################################################################
// TQTXErrorObject
//############################################################################

function TQTXErrorObject.getUseException:Boolean;
Begin
  result:=FUseException;
end;

procedure TQTXErrorObject.setUseException(aValue:Boolean);
Begin
  FUseException:=aValue;
end;

function TQTXErrorObject.getExceptionType:TQTXExceptionClass;
Begin
  result:=EQTXException;
end;


procedure TQTXErrorObject.setLastError(aValue:String);
begin
  FLastError:=trim(aValue);
  if getUseException then
  raise getExceptionType.Create(FLastError);
end;

procedure TQTXErrorObject.setLastErrorF(aValue:String;
          const aItems:Array of const);
begin
  setLastError(Format(aValue,aItems));
end;

function  TQTXErrorObject.getLastError:String;
Begin
  result:=FLastError;
end;

procedure TQTXErrorObject.clearLastError;
Begin
  FLastError:='';
end;

end.

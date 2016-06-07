unit qtxScrollController;
 
//#############################################################################
//
//  Unit:       qtxScrollController.pas
//  Author:     Jon Lennart Aasenden
//  Company:    Jon Lennart Aasenden LTD
//  Copyright:  Copyright Jon Lennart Aasenden, all rights reserved
//
//  About:      This unit introduces wrapper classes for iScroll, and
//              provides a baseclass for scrolling content
//              (TScrollingWinControl under Delphi).
//
//  Note:       Save "iScroll.js" (built for version 5.1.2) to SMS/Libs
//              See iScroll documentation for more information.
//
//              IScroll homepage: http://cubiq.org/iscroll-5
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
//#############################################################################
 
interface
 
uses
  System.Types, SmartCL.System, SmartCL.Components, SmartCL.Effects,
  w3c.dom,
  qtxutils;
 
  type
 
  (* These are the constructor parameters for iScroll.
     Note: this object is managed by the controller.
     This structure represents the constructor parameter for iScroll. *)
  TQTXScrollOptions = Class(TObject)
  public
    property    MouseWheel:Boolean;
    Property    VerticalScrollbar:Boolean;
    Property    HorizontalScrollbar:Boolean;
    Property    FixedScrollbar:Boolean;
    Property    FadeScrollbar:Boolean;
    Property    HideScrollbar:Boolean;
    Property    Bounce:Boolean;
    Property    Momentum:Boolean;
    Property    LockDirection:Boolean;
    Property    Zoom:Boolean;
    Property    ZoomMax:Integer;
    Property    ScrollBarClass:String;
    Property    Click:Boolean;
    function    toJSON:Variant;virtual;
    constructor Create;virtual;
  End;
 
  (* This is the IScroll controller/wrapper.
     Elements who wants to use IScroll should create an instance
     of this class, and then attach it to the element handle.
     Remember to detach and release the controller in
     the destructor. *)
  TQTXScrollController = Class(TObject)
  private
    FControl:   THandle;
    FHandle:    THandle;
    FEnabled:   Boolean;
    FOptions:   TQTXScrollOptions;
    FOnAttach:  TNotifyEvent;
    FOnDetach:  TNotifyEvent;
  protected
    procedure   setEnabled(const aValue:Boolean);
    function    getReady:Boolean;
  public
    Property    Enabled:Boolean read FEnabled write setEnabled;
    Property    ControlHandle:THandle read FControl;
    Property    Options:TQTXScrollOptions read FOptions write FOptions;
    Property    Handle:THandle read FHandle;
    Property    Ready:Boolean read getReady;
    Procedure   Attach;
    Procedure   Detach;
    Procedure   Refresh;
    Procedure   Stop;
    Procedure   ScrollTo(x,y:Integer;time:Integer;relative:Boolean);
    Procedure   ScrollToElement(const aElement:String;time:Integer);overload;
    Procedure   ScrollToElement(const aElement:THandle;time:Integer);overload;
    Procedure   ScrollToPage(PageX,PageY:Integer;time:Integer);
    Constructor Create(Const aHandle:THandle);virtual;
    Destructor  Destroy;Override;
  published
    Property    OnAttached:TNotifyEvent read FOnAttach write FOnAttach;
    Property    OnDetached:TNotifyEvent read FOnDetach write FOnDetach;
  End;
 
  (* Scrollable content placeholder.
     An instance of this class is created automatically by TW3ScrollWindow.
     To introduce another content class, derive class from
     TQTXScrollWindowContentClass - then override getScrollContentClass
     in TW3ScrollWindow and return your own derived classtype *)
  TQTXScrollWindowContent = Class(TW3CustomControl)
  end;
  TQTXScrollWindowContentClass = Class of TQTXScrollWindowContent;
 
  (* Scrollable content custom-control.
     If you need smooth, momentum based scrolling of content -- derive
     your custom control from this baseclass. *)
  TQTXScrollWindow = Class(TW3CustomControl)
  private
    FContent: TQTXScrollWindowContent;
    FScroller:TQTXScrollController;
  protected
    function  getScrollContentClass:TQTXScrollWindowContentClass;virtual;
    procedure InitializeObject; override;
    procedure FinalizeObject;Override;
  public
    Property  Content:TQTXScrollWindowContent read FContent;
    Property  ScrollApi:TQTXScrollController read FScroller;
  End;
 
implementation
 
{$R 'iScroll.js'}

//############################################################################
// TQTXScrollController
//############################################################################
 
Constructor TQTXScrollController.Create(Const aHandle:THandle);
Begin
  inherited Create;
  FOptions:=TQTXScrollOptions.Create;
  FControl:=aHandle;
end;
 
Destructor TQTXScrollController.Destroy;
Begin
  if (FHandle) then
  Begin
    FHandle.destroy();
    FHandle:=null;
  end;
  FOptions.free;
  inherited;
end;
 
function TQTXScrollController.getReady:Boolean;
Begin
  if (FHandle) then
  Begin
    try
      result:=FHandle.isReady();
    except
      on e: exception do
      raise EW3Exception.CreateFmt
      ('IScroll->isReady() threw exception: [%s]',[e.message]);
    end;
  end;
end;
 
Procedure TQTXScrollController.Stop;
Begin
  if (FHandle) then
  Begin
    try
      FHandle.stop();
    except
      on e: exception do
      raise EW3Exception.CreateFmt
      ('IScroll->Stop() threw exception: [%s]',[e.message]);
    end;
  end;
end;
 
procedure  TQTXScrollController.setEnabled(const aValue:Boolean);
Begin
  if (FHandle) then
  Begin
    if aValue<>FEnabled then
    begin
      try
        case aValue of
        true:   FHandle.enable();
        false:  FHandle.disable();
        end;
        FEnabled:=aValue;
      except
        on e: exception do
        raise EW3Exception.CreateFmt
        ('IScroll->setEnabled([bool]) threw exception: [%s]',[e.message]);
      end;
    end;
  end;
end;
 
Procedure TQTXScrollController.Refresh;
begin
  if (FHandle) then
  Begin
    try
      FHandle.refresh();
    except
      on e: exception do
      raise EW3Exception.CreateFmt
      ('IScroll->Refresh() threw exception: [%s]',[e.message]);
    end;
  end;
end;
 
Procedure TQTXScrollController.ScrollTo(x,y:Integer;
          time:Integer;relative:Boolean);
Begin
  if (FHandle) then
  Begin
    try
      FHandle.scrollTo(x,y,time,relative);
    except
      on e: exception do
      raise EW3Exception.CreateFmt
      ('IScroll->ScrollTo([int,int]) threw exception: [%s]',[e.message]);
    end;
  end;
end;
 
Procedure TQTXScrollController.ScrollToPage(PageX,PageY:Integer;time:Integer);
Begin
  if (FHandle) then
  Begin
    try
      FHandle.scrollToPage(pageX,PageY,time);
    except
      on e: exception do
      raise EW3Exception.CreateFmt
      ('IScroll->ScrollToPage([int,int,int]) threw exception: [%s]',[e.message]);
    end;
  end;
end;
 
Procedure TQTXScrollController.ScrollToElement
         (const aElement:String;time:Integer);
Begin
  if (FHandle) then
  Begin
    try
      FHandle.scrollToElement(aElement,time);
    except
      on e: exception do
      raise EW3Exception.CreateFmt
      ('IScroll->ScrollToElement([str,int]) threw exception: [%s]',[e.message]);
    end;
  end;
end;
 
Procedure TQTXScrollController.ScrollToElement
          (const aElement:THandle;time:Integer);
Begin
  if (FHandle) then
  Begin
    try
      FHandle.scrollToElement(aElement,time);
    except
      on e: exception do
      raise EW3Exception.CreateFmt
      ('IScroll->ScrollToElement([handle,int]) threw exception: [%s]',[e.message]);
    end;
  end;
end;
 
Procedure TQTXScrollController.Attach;
var
  mHandle:  THandle;
  mTemp:    THandle;
  mOptions: Variant;
Begin
  (* Shut down current instance *)
  if (FHandle) then
  Detach;
 
  (* setup iScroll options *)
  mOptions:=FOptions.toJSON;
 
  (* Create iScroll controller for our viewport *)
  try
    mHandle:=FControl;
    asm
      @mTemp = new IScroll(@mHandle,@mOptions);
    end;
    FHandle:=mTemp;
  except
    on e: exception do
    raise EW3Exception.CreateFmt
    ('Failed to create IScroll instance: %s',[e.message]);
  end;
 
  FEnabled:=True;
 
  if assigned(FOnAttach) then
  FOnAttach(Self);
 
end;
 
Procedure TQTXScrollController.Detach;
Begin
  if (FHandle) then
  begin
    try
      try
        FHandle.destroy();
        FHandle:=Null;
      except
        on e: exception do
        raise EW3Exception.CreateFmt
        ('Failed to destroy IScroll instance: %s',[e.message]);
      end;
    finally
      FEnabled:=False;
    end;
 
    if assigned(FOnDetach) then
    FOnDetach(self);
 
  end;
end;
 
//############################################################################
// TQTXScrollOptions
//############################################################################
 
constructor TQTXScrollOptions.Create;
Begin
  inherited Create;
  mouseWheel:=True;
  Bounce:=True;
  Momentum:=True;
  ZoomMax:=4;
  VerticalScrollbar:=True;
  HorizontalScrollbar:=false;
  HideScrollbar:=false;
  Click:=true;
end;
 
function TQTXScrollOptions.toJSON:Variant;
Begin
  (* Push IScroll options into JSON object *)
  result:=TVariant.createObject;
  result.mouseWheel:=mouseWheel;
  result.hScrollbar:=HorizontalScrollbar;
  result.vScrollbar:=verticalScrollbar;;
  result.fixedScrollbar:=fixedScrollbar;
  result.fadeScrollbar:=fadeScrollbar;
  result.hideScrollbar:=hideScrollbar;
  result.bounce:=bounce;
  result.momentum:=momentum;
  result.zoom:=Zoom;
  result.zoomMax:=ZoomMax;
  result.scrollbarClass:=ScrollBarClass;
  result.lockDirection:=lockDirection;
  if Click then
  result.click:='true';

end;
 
//############################################################################
// TQTXScrollWindow
//############################################################################
 
procedure TQTXScrollWindow.InitializeObject;
Begin
  inherited;
  FContent:=getScrollContentClass.Create(self);
  FContent.Height:=0;
 
  w3_setStyle(FContent.Handle,'postion','relative');
  w3_setStyle(FContent.Handle,'min-width','100%');
  w3_setStyle(FContent.Handle,'min-height','0px');
 
  FScroller:=TQTXScrollController.Create(self.Handle);
 
  (* Attach IScroll when DOM element ready *)
  Handle.readyExecute( procedure ()
    begin
      FScroller.Attach;
    end );
end;
 
procedure TQTXScrollWindow.FinalizeObject;
Begin
  FScroller.Detach;
  FScroller.free;
  FContent.free;
  inherited;
end;
 
function TQTXScrollWindow.getScrollContentClass:TQTXScrollWindowContentClass;
Begin
  result:=TQTXScrollWindowContent;
end;
 
end.

unit qtxscrolltext;

interface

uses 
  System.Types, SmartCL.System, SmartCL.Components, SmartCL.Effects,
  w3c.dom,
  qtxeffects,
  qtxutils;

  Type

  TQTXScrollText = Class(TW3CustomControl)
  private
    FActive:  Boolean;
    FText:    String;
    FSpeed:   Integer;
    FContent: TW3CustomControl;
    function  getSpeed:Integer;
    Procedure setSpeed(const aValue:Integer);
    procedure setText(aValue:String);
    Procedure setActive(const aValue:Boolean);

    Procedure UpdateScroll;

  protected
    Procedure Resize;override;
  protected
    procedure InitializeObject;Override;
    Procedure FinalizeObject;Override;
  published
    Property  Active:Boolean read FActive write setActive;
    Property  Text:String read FText write setText;
    Property  Speed:Integer read getSpeed write setSpeed;
  End;

implementation

procedure TQTXScrollText.InitializeObject;
begin
  inherited;
  FContent:=TW3CustomControl.Create(self);

  FContent.handle.style.background:='transparent';

  Handle.readyExecute( procedure ()
    Begin
      Font.Name:='verdana';
      Font.Size:=16;
    end);
end;

Procedure TQTXScrollText.FinalizeObject;
Begin
  FContent.free;
  inherited;
end;

function  TQTXScrollText.getSpeed:Integer;
Begin
  result:=FSpeed;
end;

Procedure TQTXScrollText.setSpeed(const aValue:Integer);
Begin
  FSpeed:=TInteger.ensureRange(aValue,1,10);
end;

procedure TQTXScrollText.setText(aValue:String);
Begin
  aValue:=trim(aValue);
  if aValue<>FText then
  Begin
    FText:=aValue;
    FContent.InnerHtml:=FText;

    if FActive then
    begin
      FContent.left:=clientWidth;
      FContent.top:=(Height div 2) - (FContent.height div 2);
    end;
  end;
end;

Procedure TQTXScrollText.UpdateScroll;
begin
  FContent.fxMoveTo(-FContent.width,
  (Height div 2) - (FContent.height div 2),
  StrToFloat(IntToStr(22-FSpeed) +'.0'),
    procedure ()
      Begin
        if FActive then
        TQTXRuntime.DelayedDispatch( procedure ()
          Begin
            FContent.left:=clientWidth;
            FContent.top:=(Height div 2) - (FContent.height div 2);
            UpdateScroll;
          end,
          120);
      end);
end;

Procedure TQTXScrollText.setActive(const aValue:Boolean);
var
  mMetrics: TQTXTextMetric;
Begin
  if aValue<>FActive then
  Begin
    FActive:=aValue;
    if FActive then
    Begin
      FContent.handle.style['color']:='#FFFFFF';
      FContent.handle.style['font']:='22px Verdana';
      FContent.handle.style.background:='transparent';

      mMetrics:=self.MeasureText(FText);

      //mMetrics:=TQTXTools.calcTextMetrics(FText,'Verdana',22);
      FContent.Width:=mMetrics.tmWidth;
      FContent.Height:=mMetrics.tmHeight;

      FContent.Left:=clientwidth;
      FContent.top:=(Height div 2) - (FContent.height div 2);
      UpdateScroll;
    end;
  end;
end;

Procedure TQTXScrollText.Resize;
Begin
  inherited;

  if assigned(FContent)
  and FContent.handle.Ready
  and Handle.Ready then
  //and TQTXTools.getElementInDOM(FContent.handle)
  //and TQTXTools.getElementInDOM(Handle) then
  begin
    if not FActive then
    Begin
      if assigned(FContent) then
      FContent.left:=clientWidth+1;
      exit;
    end;

    if assigned(FContent) then
    FContent.top:=(Height div 2) - (FContent.height div 2);
  end;
end;

end.

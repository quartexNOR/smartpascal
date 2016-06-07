unit caseList;

interface

uses 
  W3System, w3components, w3label, w3image,
  w3styles,
  w3Graphics,

  qtxUtils,
  qtxlabel,
  qtxScrollController,
  qtxEffects;

type


  TCBGlyphButton = Class(TW3CustomControl)
  private
    FGlyph:   TW3CustomControl;
    FCaption: TQTXLabel;
  protected
    procedure Resize;override;
  public
    Property  Glyph:TW3CustomControl read FGlyph;
    Property  Text:TQTXLabel read FCaption;
    Procedure InitializeObject;Override;
    Procedure FinalizeObject;Override;
  End;

  //TCBProfileHeader = Class(TW3CustomControl)
  //End;

  TCBPanel = Class(TW3CustomControl)
  protected
    class function supportAdjustment: Boolean; override;
    class function DisplayMode : String; override;
  End;


  TCBNewsItem = Class(TW3CustomControl)
  private
    FImage:     TW3Image;
    FTitle:     TQTXLabel;
    FTimeInfo:  TQTXLabel;
    FText:      TQTXLabel;
  protected
    Procedure   Resize;Override;
  public
    procedure   InitializeObject;Override;
    Procedure   FinalizeObject;Override;
  public
    class var Index:Integer;
    Property    Image:TW3Image read FImage;
    Property    Title:TQTXLabel read FTitle;
    Property    TimeInfo:TQTXLabel read FTimeInfo;
    Property    Text:TQTXLabel read FText;
    Procedure   StyleTagObject;override;
  End;

  TCaseBookListItem = Class(TW3CustomControl)
  private
    FGlyph: TW3Image;
    FTitle: TW3Label;
    FTime:  TW3Label;
    FText:  TW3Label;
  public
    Property  Glyph:TW3Image read FGlyph;
    Property  Title:String
              read  ( FTitle.Caption )
              write ( FTitle.caption:=Value );

    Property  Time:String
              read  ( FTime.caption )
              write ( FTime.Caption:=Value);

  End;

  TCaseBookList = Class(TQTXScrollWindow)
  protected
    procedure InitializeObject;Override;
  End;

implementation

//############################################################################
// TCBPanel
//############################################################################

class function TCBPanel.supportAdjustment:Boolean;
Begin
  result:=true;
end;

class function TCBPanel.DisplayMode:String;
Begin
  result:='inline';//inherited displaymode;
end;


//############################################################################
// TCaseBookList
//############################################################################

Procedure TCaseBookList.InitializeObject;
Begin
  inherited;
  TQTXTools.ExecuteOnElementReady(Handle, procedure ()
  Begin
    resize;
  end);
end;


//#############################################################################
// TCBGlyphButton
//#############################################################################

Procedure TCBGlyphButton.InitializeObject;
Begin
  inherited;
  FGlyph:=TW3CustomControl.Create(self);
  FGlyph.setSize(16,16);
  FGlyph.handle.style['background']:='transparent';
  FGlyph.Handle.style['text-align']:='center';

  Handle.style['border-style']:='solid';
  Handle.style['border-width']:='1px';
  Handle.style['border-color']:='#CECECE';

  FGlyph.handle.style['color']:='#AFAFAF';

  FCaption:=TQTXLabel.Create(self);
  FCaption.handle.style['background']:='transparent';
  FCaption.Autosize:=false;
  FCaption.Height:=18;
  FCaption.Width:=40;
  FCaption.Caption:='';

  TQTXTools.ExecuteOnElementReady(Handle, procedure ()
    Begin
      LayoutChildren;
    end);
end;

Procedure TCBGlyphButton.FinalizeObject;
Begin
  FGlyph.free;
  FCaption.free;
  inherited;
end;

procedure TCBGlyphButton.Resize;
var
  dx: Integer;
  dy: Integer;
  mText:  String;
  wd: Integer;
  xx: Integer;
Begin
  inherited;

  if FGlyph.handle.ready then
  begin
    mText:=trim(FCaption.Caption);
    if mText.Length>0 then
    Begin
      dy:=(clientHeight div 2) - (FGlyph.Height div 2);
      FGlyph.MoveTo(1,dy);
    end else
    Begin
      dx:=(ClientWidth div 2) - (FGlyph.width div 2);
      dy:=(clientHeight div 2) - (FGlyph.Height div 2);
      FGlyph.MoveTo(dx,dy);

      FCaption.moveto(-FCaption.Width,-FCaption.Height);
      exit;
    end;
  end;

  if FCaption.handle.ready then
  begin
    xx:=FGlyph.left + FGlyph.Width;
    dy:=(clientheight div 2) - (FCaption.height div 2);

    dx:=((clientWidth-xx) div 2) - (FCaption.width div 2);
    inc(dx,xx);
    FCaption.setBounds(dx,dy,FCaption.Width,FCaption.height);
  end;

end;

//#############################################################################
// TCBNewsItem
//#############################################################################

procedure TCBNewsItem.InitializeObject;
Begin
  inherited;
  FImage:=TW3Image.Create(self);
  FTitle:=TQTXLabel.Create(self);

  Handle.style['border-style']:='solid';
  Handle.style['border-width']:='1px';
  Handle.style['border-color']:='#cccccc';

  handle.style['background']:='#FFFFFF';

  FTimeInfo:=TQTXLabel.Create(self);
  FTimeInfo.Font.size:=12;
  FTimeInfo.font.Color:=clGrey;
  FTimeInfo.Caption:='Smart Pascal wrote at ' + TimeToStr(now);

  FText:=TQTXLabel.Create(self);
  FText.font.size:=14;
  //FText.Font.Color:=RGBToColor($55,$55,$55);

  (* FText.Handle.style['border-style']:='solid';
  FText.Handle.style['border-width']:='1px';
  FText.Handle.style['border-color']:='#cccccc';  *)

  Handle.ReadyExecute( procedure ()
  //TQTXTools.ExecuteOnElementReady(Handle, procedure ()
    Begin
      Resize;
    end);
end;

Procedure TCBNewsItem.FinalizeObject;
Begin
  FImage.free;
  FTitle.free;
  FTimeInfo.free;
  Ftext.free;
  inherited;
end;

Procedure TCBNewsItem.StyleTagObject;
begin
  inherited;
  //Handle.style['border-radius']:='8px';
  background.fromColor(clWhite);
end;

Procedure TCBNewsItem.Resize;
Begin
  inherited;

  if handle.ready then
  //if TQTXTools.getHandleReady(self.handle) then
  begin
    FImage.setbounds(4,4,36,36);
    FTitle.setBounds(44,4,clientwidth-(44 + 4),22);
    FTimeInfo.setBounds(44,24,clientwidth-(44 + 4),16);
    FText.setBounds(4,44 + 8,clientwidth-8,clientHeight-49);
  end;
end;


end.

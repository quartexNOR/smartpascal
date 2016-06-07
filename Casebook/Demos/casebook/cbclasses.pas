unit cbclasses;

interface

uses 
  W3System, w3components, w3label, w3image, w3panel,
  w3styles, w3Graphics, w3application, w3memo,

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

  TCBDialogInfo = Class(TObject)
  private
    FBlocker:   TW3BlockBox;
    FBox:       TW3Panel;
    FCancel:    TCBGlyphButton;
    FPost:      TCBGlyphButton;
    FEditor:    TW3Memo;
    FTitle:     TQTXLabel;
  public
    property    Editor:TW3Memo read FEditor;
    Property    BackgroundBlocker:TW3BlockBox read FBlocker;
    Property    Panel:TW3Panel read FBox;
    property    CancelButton:TCBGlyphButton read FCancel;
    Property    PostButton:TCBGlyphButton read FPost;

    Constructor Create;virtual;
    Destructor  Destroy;Override;
  End;

  TCBNotifierPlack = Class(TObject)
  private
    FBox:       TW3Panel;
  public
    Property    Box:TW3Panel read FBox;
    procedure   Show;
    Constructor Create(AOwner:TW3CustomControl);virtual;
    Destructor  Destroy;Override;
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
    FUrl:       String;
    Procedure   HandleTextChange(sender:TObject);
  protected
    Procedure   Resize;Override;
  public
    procedure   InitializeObject;Override;
    Procedure   FinalizeObject;Override;
  public
    class var Index:Integer;
    Property    URL:String read FUrl write FUrl;
    Property    Image:TW3Image read FImage;
    Property    Title:TQTXLabel read FTitle;
    Property    TimeInfo:TQTXLabel read FTimeInfo;
    Property    Text:TQTXLabel read FText;
    Procedure   StyleTagObject;override;
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
  //TQTXTools.ExecuteOnElementReady(Handle, procedure ()
  Handle.readyExecute( procedure ()
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

  //TQTXTools.ExecuteOnElementReady(Handle, procedure ()
  Handle.readyExecute( procedure ()
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
  FText.Autosize:=False;
  FText.OnChanged:=HandleTextChange;
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

Procedure TCBNewsItem.HandleTextChange(sender:TObject);
Begin
  beginupdate;
  try
    FText.height:=FText.MeasureTextFixed(FText.caption).tmHeight;
    self.height:=FText.top + FText.height + 6;
  finally
    EndUpdate;
  end;
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
    FText.left:=4;
    FText.top:=44+8;
    FText.width:=clientWidth-8;
    //FText.height:=FText.MeasureTextFixed(FText.caption).tmHeight;

    (* This will cause one immediate resize *)
    //self.height:=FText.top + FText.height + 6;
  end;
end;



//#############################################################################
// TCBNotifierPlack
//#############################################################################

Constructor TCBNotifierPlack.Create(AOwner:TW3CustomControl);
const
  CNT_Width   = 280;
  CNT_Height  = 100;
Begin
  inherited Create;
  FBox:=TW3Panel.Create(aOwner);
  FBox.visible:=False;
  FBox.setBounds(
    (AOwner.ClientWidth div 2) - (CNT_WIDTH div 2),
    //(AOwner.clientHeight - CNT_HEIGHT),
    AOwner.ClientHeight + CNT_HEIGHT,
    CNT_WIDTH,
    CNT_HEIGHT);
  FBox.OnMouseTouchClick:=Procedure (Sender: TObject; Button: TMouseButton;
    Shift: TShiftState; X, Y: Integer)
    Begin
      FBox.fxFadeOut(0.3,
        procedure ()
        begin
          FBox.free;
        end);
    end;
end;

Destructor TCBNotifierPlack.Destroy;
Begin
  FBox.free;
  inherited;
end;

procedure TCBNotifierPlack.Show;
Begin
  FBox.fxFadeIn(0.5, procedure ()
  begin
    FBox.fxMoveTo(FBox.Left,
    (TW3CustomControl(FBox.Parent).ClientHeight div 2) - FBox.Height div 2,
    0.6, procedure ()
      begin
        TQTXRuntime.DelayedDispatch( procedure ()
          Begin
            FBox.fxFadeOut(0.3,
              procedure ()
              begin
                self.free;
              end);
          end,
          1000 * 8);
      end);
  end);
end;

//#############################################################################
// TCBDialogInfo
//#############################################################################

Constructor TCBDialogInfo.Create;
var
  dx: Integer;
  dy: Integer;
  wd: Integer;
Begin
  inherited Create;

  FBlocker := TW3BlockBox.Create(Application.Display);
  FBlocker.SetBounds(0,0,Application.Display.Width,Application.Display.Height);
  FBlocker.BringToFront;

  FBox:=TW3Panel.Create(FBlocker);
  FBox.SetBounds(10,20,300,280);
  FBox.moveTo((application.display.clientwidth div 2) - FBox.width div 2,
    (application.display.clientHeight div 2) - FBox.height div 2);

  FEditor:=TW3Memo.Create(FBox);
  FEditor.SetBounds(10,40,FBox.ClientWidth-20,(FBox.ClientHeight-20) - 80);

  FTitle:=TQTXLabel.Create(FBox);
  FTitle.MoveTo(10,10);
  FTitle.Caption:='Add new post';

  dy:=FBox.ClientHeight-40;
  wd:=((FBox.ClientWidth - 40) div 2) - 20;
  Fpost:=TCBGlyphButton.Create(FBox);
  Fpost.setBounds(10,dy,wd,26);
  FPost.text.Autosize:=False;
  FPost.text.height:=16;
  FPost.Text.Caption:='Post';
  FPost.glyph.innerHTML:='<i class="fa fa-bolt fa-2x">';
  FPost.LayoutChildren;
  FPost.Glyph.height:=26;

  dx:=(FBox.ClientWidth - 10) - wd;
  FCancel:=TCBGlyphButton.Create(FBox);
  FCancel.setBounds(dx,dy,wd,26);
  FCancel.text.Autosize:=False;
  FCancel.text.height:=16;
  FCancel.text.caption:='Cancel';
  FCancel.glyph.innerHTML:='<i class="fa fa-times fa-2x">';
  FCancel.LayoutChildren;
  FCancel.Glyph.height:=26;
  FCancel.OnMouseTouchRelease:=Procedure (Sender: TObject; Button: TMouseButton;
    Shift: TShiftState; X, Y: Integer)
    Begin
      FBox.fxZoomOut(0.3, procedure ()
      Begin
        self.free;
      end);
    end;

  FBox.fxZoomIn(0.3);

end;

Destructor TCBDialogInfo.Destroy;
Begin
  FPost.free;
  FTitle.free;
  FEditor.free;
  FBox.free;
  FBlocker.free;
  inherited;
end;


end.

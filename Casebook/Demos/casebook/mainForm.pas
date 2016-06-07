unit mainForm;

interface

{.$DEFINE DEBUG_MODE}

uses 

  w3panel, w3time, W3System, W3Graphics, W3Components, W3Forms, w3Panel,
  W3Fonts, W3Borders, W3Image, W3Application, W3Button, W3Label, w3dialogs,
  w3effects, w3memo,  w3inet, w3c.dom,
  cbclasses,
  qtxheader,
  qtxEffects,
  qtxScrollController,
  qtxUtils,
  qtxlabel,
  qtxscrolltext;

  type

  TForm1=class(TW3form)
  private
    {$I 'mainForm:intf'}
    FList:    TCaseBookList;
    FPanel:   TCBPanel;
    FHomeButton: TCBGlyphButton;
    FProfileButton: TCBGlyphButton;
    FNewButton:TCBGlyphButton;
    FMore:      TCBGlyphButton;
    FFirst:   Boolean = true;
    Procedure Populate(const item:TCBNewsItem);
    Procedure setupItems;
  protected
    procedure InitializeForm; override;
    procedure InitializeObject; override;
    procedure Resize; override;
    procedure FormActivated; override;
  public

  end;

implementation

{ TForm1}
uses casebook, W3MouseTouch;


//#############################################################################
// FORM
//#############################################################################

procedure TForm1.FormActivated;
Begin
  inherited;
  writeln('Form1 activated');
  TApplication(application).Header.Title.Caption:='CaseBook';
  TApplication(application).Header.Backbutton.visible:=False;

  if FFirst then
  Begin
    FFirst:=False;


      TQTXRuntime.DelayedDispatch( procedure ()
      begin
        {$IFNDEF DEBUG_MODE}
        if width<>320 then
        Begin
          application.ShowDialog('Display warning',#"
            This application was built for<br>
            iPhone 5. Your display may presently<br>
            not compatible with the layout",aoOK);
        end;
        {$ENDIF}
      end,
      1000);

      (* Show welcome plack *)
      {$IFNDEF DEBUG_MODE}
      var mX:=TCBNotifierPlack.Create(self);
      mx.Box.InnerHTML:='<br><center><b>Welcome to CaseBook</b><br>'
        + 'CaseBook was coded in <a href="http://www.smartmobilestudio.com">Smart Mobile Studio</a><br>'
        + 'The number one HTML5 authoring tool for<br>'
        + 'creating rich, object oriented HTML5 apps!';
      mX.Show;
      {$ENDIF}
  end;

end;

procedure TForm1.InitializeForm;
begin
  inherited;

  FList.content.handle.style['background-color']:='transparent';
  Flist.handle.style['background-color']:='transparent';

    Handle.readyExecute( procedure ()
    begin
      TQTXRuntime.DelayedDispatch( procedure ()
        Begin
          setupItems;
        end,
        500);

    end);

end;

procedure TForm1.InitializeObject;
const
  CNT_Height  = 34;
var
  mDialog:  TCBDialogInfo;
begin
  inherited;
  {$I 'mainForm:impl'}
  FList:=TCaseBookList.Create(self);

  FPanel:=TCBPanel.Create(self);
  FPanel.Height:=200;
  FPanel.BeginUpdate;
  try

    FPanel.styleclass:='tardis';
    FPanel.background.fromColor(clWhite);
    FPanel.Visible:=False;

    FNewButton:=TCBGlyphButton.Create(FPanel);
    FNewButton.BeginUpdate;
    try
      FNewButton.left:=2;
      FNewButton.width:=80;
      FNewButton.height:=CNT_Height;
      FNewButton.text.Autosize:=True;
      FNewButton.Text.Caption:='Post';
      FNewButton.Glyph.StyleClass:='fa fa-file';
      FNewButton.OnMouseTouchRelease:=Procedure (Sender: TObject; Button: TMouseButton;
        Shift: TShiftState; X, Y: Integer)
        Begin
          mDialog:=TCBDialogInfo.Create;
          mDialog.PostButton.OnMouseTouchRelease:=Procedure (Sender: TObject; Button: TMouseButton;
            Shift: TShiftState; X, Y: Integer)
            begin
              (* zoom out dialog and cleanup *)
              mDialog.Panel.fxZoomOut(0.3, procedure ()
              var
                mText:  String;
              begin
                (* Capture message text, then release dialog *)
                mText:=trim(mDialog.Editor.text);
                mDialog.free;
                showmessage('You posted a message:' + #13 + #13 + mText);
              end);
            end;
        end;
    finally
      FNewButton.EndUpdate;
    end;

    FProfileButton:=TCBGlyphButton.Create(FPanel);
    FProfileButton.BeginUpdate;
    try
      FProfileButton.left:=84;
      FProfilebutton.width:=80;
      FProfilebutton.height:=CNT_Height;
      FProfilebutton.text.Autosize:=True;
      Fprofilebutton.Text.Caption:='Profile';
      Fprofilebutton.Glyph.StyleClass:="fa fa-user";
      FProfilebutton.OnMouseTouchRelease:=Procedure (Sender: TObject; Button: TMouseButton;
        Shift: TShiftState; X, Y: Integer)
        Begin
          Application.gotoForm('FormProfile',feFromRight);
        end;
    finally
      FProfileButton.EndUpdate;
    end;

    FHomeButton:=TCBGlyphButton.Create(FPanel);
    FHomeButton.BeginUpdate;
    try
      FHomeButton.left:=166;
      FHomeButton.width:=86;
      FHomeButton.height:=CNT_Height;
      FHomeButton.Text.Autosize:=True;
      FHomeButton.Text.Caption:='Logout';
      FHomeButton.LayoutChildren;
      FHomeButton.Glyph.StyleClass:="fa fa-arrow-circle-left";
      FHomeButton.OnMouseTouchRelease:=Procedure (Sender: TObject; Button: TMouseButton;
        Shift: TShiftState; X, Y: Integer)
      Begin
        TQTXRuntime.DelayedDispatch( procedure ()
          begin
            TApplication(application).ShowDialog('<li class="fa fa-warning">&nbsp</li>Logout?',
            'Are you sure you wish to log<br>out of this application?',aoYesNo);
            application.OnDialogSelect:=Procedure (Sender: TObject; aResult: TW3AlertResult)
              Begin
                if aResult=roYes then
                begin
                  TApplication(application).FormLogin.ResetState;
                  application.gotoForm('FormLogin',feToLeft);
                end;
            end;
          end,
          200);

        end;
    finally
      FHomeButton.EndUpdate;
    end;

    FMore:=TCBGlyphButton.Create(FPanel);
    FMore.SetBounds(255 + 26,4,CNT_Height+2,36);
    FMore.Text.Visible:=False;
    FMore.glyph.handle.style['color']:='#2d3642';
    FMore.Glyph.StyleClass:='fa fa-bars';
    FMore.OnMouseTouchRelease:= Procedure
      (Sender: TObject; Button: TMouseButton;Shift: TShiftState; X, Y: Integer)
      var
        mPanel: TW3Panel;
        dy: Integer;
      Begin
        mPanel:=TW3Panel.Create(self);

        dy:=FMore.top + FMore.height;

        mPanel.SetBounds(FMore.left,dy, FMore.Width,FMore.Height);
        mPanel.fxScaleTo(20,dy,Clientwidth-40,130 ,0.5,
          procedure ()
          begin
            mPanel.InnerHTML:=#"<br><center>Coded by<br>
              <b>Jon Lennart Aasenden</b><br>
              Cipher Diaz of <u>QUARTEX</u><br><br>
              Written in Smart Mobile Studio<br>
              The #1 HTML5 development suite";
          end);

        mPanel.OnMouseTouchRelease:= Procedure
              (Sender: TObject; Button: TMouseButton;Shift: TShiftState; X, Y: Integer)
        Begin
          mPanel.free;
        end;
        TQTXRuntime.DelayedDispatch( procedure ()
          Begin
            mPanel.free;
            mpanel:=NIL;
          end,6 * 1000);
      end;

  finally
    FPanel.EndUpdate;
    FPanel.fxFadeIn(0.1);
  end;
end;


 
procedure TForm1.Resize;
var
  wd: Integer;
begin
  inherited;
  if handle.ready then
  Begin
    FPanel.setBounds(0,0,clientWidth,44);

    FHomeButton.top:=(FPanel.ClientHeight div 2) - (FHomeButton.height div 2);
    FProfileButton.top:=(FPanel.ClientHeight div 2) - (FProfileButton.Height div 2);
    FNewButton.top:=(FPanel.ClientHeight div 2) - (FNewButton.Height div 2);


    wd:=TInteger.EnsureRange(Clientwidth-4,0,320);
    FList.setBounds(2,FPanel.Height,wd,clientHeight-FPanel.Height);
  end;
end;


Procedure TForm1.Populate(const item:TCBNewsItem);
Begin
  if (TCBNewsItem.Index mod 5)=0 then
  Begin
  item.Image.LoadFromURL('res/avatar01.jpg');
  item.title.Caption:='<b>Smart Mobile Studio</b>';
  Item.TimeInfo.caption:='SMARTMOBILESTUDIO.COM wrote @ ' + TimeToStr(now);

  item.Text.Caption:=#'The market has spoken: single source, multi-platform,
  HTML5 based, client-server application development is the future.
  Finally a “write once, run anywhere” solution that delivers!
  Presenting <a href="http://www.smartmobilestudio.com">Smart Mobile Studio</a> ..';
  end else
  if (TCBNewsItem.Index mod 5)=1 then
  Begin
  item.Image.LoadFromURL('res/avatar02.jpg');
  item.title.Caption:='<b>Get the Asssassins-Creed hoodie</b>';
  Item.TimeInfo.caption:='ASSASSINSHOODIES.COM wrote @ ' + TimeToStr(now);
  item.Text.Caption:='Absolute must-have in any mans wardrobe.'
    +'Only $26.90 USD + Free Shipping!<br>'
    +'Get it now: <a href="http://bit.ly/Assassins-I">http://bit.ly/Assassins-I</a> '
    +'Materials: 80% Polyester, 20% Cotton<br>'
    +'Style: With Hood '
    +'Features: Anti-Pilling, Anti-Shrink, Breathable';
  end else
  if (TCBNewsItem.Index mod 5)=2 then
  Begin
  item.Image.LoadFromURL('res/avatar03.png');
  item.title.Caption:='<b>Classic Platformer Another World Coming to PS4, PS3</b>';
  Item.TimeInfo.caption:='PLAYSTATION.COM wrote @ ' + TimeToStr(now);
  item.Text.Caption:=#'<a href="http://blog.us.playstation.com/2014/06/17/classic-platformer-another-world-is-coming-to-ps4-next-week/">Another World</a> is confirmed for launch on July 8th for PS4, PS3,
          and PS Vita — including three-way cross buy support across
          those platforms. We apologize for any confusion the previous
          version of this post may have caused!';
  end else
  if (TCBNewsItem.Index mod 5)=3 then
  Begin
  item.Image.LoadFromURL('res/avatar04.jpg');
  item.title.Caption:='<b>Delphi XE6</b>';
  Item.TimeInfo.caption:='EMBARCADERO.COM wrote @ ' + TimeToStr(now);
  item.Text.Caption:=#'
      Embarcadero Delphi XE6 is the fastest way to develop true native
      applications for Windows, Mac, Android and iOS from a single codebase.
      Develop multi-device applications 5x to 20x faster with a proven visual
      development environment, component framework with source code and full
      access to platform APIs. Extend your existing Windows applications
      with mobile companion apps.';
  end else
  if (TCBNewsItem.Index mod 5)=4 then
  begin
  item.Image.LoadFromURL('res/avatar05.png');
  item.title.Caption:='<b>Create native iOS and Android apps in C#</b>';
  Item.TimeInfo.caption:='XAMARIN.COM wrote @ ' + TimeToStr(now);
  item.Text.Caption:=#'We created <a href="http://xamarin.com/">Xamarin</a> because we knew there had to be a
    better way – a better way to design apps, to develop apps, to integrate
    apps, to test apps and more. We’re developers, so we know what developers
    want from mobile app development software: a modern programming language,
    code sharing across all platforms, prebuilt backend connectors and
    no-compromise native user interfaces.';
  end;

  TCBNewsItem.Index:=TCBNewsItem.Index + 1;
end;

Procedure TForm1.setupItems;
begin

  TQTXIOAccess.LoadXML('http://feeds.feedburner.com/delphifeeds?format=xml',
    procedure (sender:TW3HttpRequest;aXML:JXMLDocument)
    var
      x:  Integer;
      dy: Integer;
      mItem:  TCBNewsItem;
      mText:  String;
      idx:  Integer;
      mObjs:  JHTMLCollection;
    begin
      dy:=4;
      if aXML<>NIL then
      mObjs :=  aXMl.getElementsByTagName('item') else
      mObjs :=  NIL;

      if (mObjs<>NIL)
      and (mObjs.length>0) then
      begin
        for x:=0 to mObjs.length-1 do
        Begin
          (* create news item with default width/height *)
          mItem:=TCBNewsItem.Create(FList.Content);
          mItem.setBounds(2,dy,FList.Content.ClientWidth-4,100);

          (* Get URL target for article *)
          mItem.Url:=mObjs[x].childnodes[3].textContent;

          (* get the title *)
          mtext:=mObjs[x].childNodes[1].textContent;
          mItem.title.caption:='<a href="' + mItem.Url +'">' + mText + '</a>';

          (* setup event for image *)
          mItem.Image.OnMouseTouchClick:=Procedure (Sender: TObject; Button: TMouseButton;
            Shift: TShiftState; X, Y: Integer)
            var
              mRef: String;
            begin
              (* Navigate to the selected article *)
              mRef:=mItem.url;
              asm
                window.location.assign(@mRef);
              end;
            end;


          (* Get signature origin *)
          mItem.TimeInfo.Caption:=mObjs[x].childnodes[7].textContent;

          (* get text snippet *)
          mItem.Text.caption:=mObjs[x].childnodes[9].textContent;

          (* just loop through avatar images at this point *)
          var mNames:Array of String =
            [
            'avatar01.jpg',
            'avatar02.jpg',
            'avatar03.png',
            'avatar04.jpg',
            'avatar05.png'
            ];
          mItem.Image.LoadFromURL('/res/' + mNames[idx]);
          inc(idx);
          if idx>4 then
          idx:=0;

          inc(dy,mItem.Height + 10);
        end;
      end else
      begin
        dy:=4;
        for x:=1 to 10 do
        begin
          mItem:=TCBNewsItem.Create(FList.Content);
          mItem.setBounds(2,dy,FList.Content.ClientWidth-4,100);
          Populate(mItem);
          inc(dy,mItem.Height + 10);
        end;
      end;

      FList.Content.Height:=dy + 16;
      FList.ScrollApi.Refresh;

    end);
end;

 
end.

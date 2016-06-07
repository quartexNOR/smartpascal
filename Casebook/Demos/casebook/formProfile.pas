unit formProfile;

interface

uses 
  W3System, W3Graphics, W3Components, W3Forms, W3Fonts,
  W3Borders, W3Application,
  qtxutils, qtxeffects, W3ScrollBar, W3Label, W3Editbox, W3ToggleSwitch, W3Image, W3Button, W3ListMenu;

type
  TformProfile=class(TW3form)
  private
    {$I 'formProfile:intf'}
  protected
    procedure InitializeForm; override;
    procedure InitializeObject; override;
    procedure Resize; override;
    procedure FormActivated; override;
    procedure FormDeactivated; override;
  end;

implementation

{ TformProfile}
uses casebook, qtxheader;

procedure TformProfile.InitializeForm;
begin
  inherited;
  // this is a good place to initialize components

end;

procedure TformProfile.InitializeObject;
var
  mItem: TW3ListItem;
begin
  inherited;
  {$I 'formProfile:impl'}

  mItem:=w3listmenu1.Items.Add;
  mItem.Text:='Your account';
  mItem.OnClick:=Procedure (sender:TObject)
    begin
      application.gotoForm('FormAccount',feFromRight);
    end;

  w3listmenu1.Items.add.text:='Network security';
  w3listmenu1.items.add.text:='Registration';

  w3listmenu2.Items.Add.Text:='Profile picture';
  w3listmenu2.Items.add.text:='Push messages';
  w3listmenu2.items.add.text:='Website';

end;
 
procedure TformProfile.Resize;
begin
  inherited;
end;

procedure TformProfile.FormActivated;
var
  mOldTitle:  String;
  mHead:  TQTXHeaderBar;
Begin
  inherited;
  mHead:=TApplication(application).Header;

  mOldTitle:=mHead.Title.Caption;
  mHead.Title.Caption:='CaseBook <i class="fa fa-angle-double-right"></i> Profile';

  mHead.backbutton.Visible:=True;

  mHead.backbutton.caption:='Back';
  mHead.backbutton.onClick:=Procedure (sender:TObject)
  Begin
    application.GotoForm('mainForm',feToLeft);
  end;

  { mHead.backbutton.OnClick:=Procedure (sender:TObject)
    begin
      (* Ipad cant handle this well *)
      if w3_getIsIPad=False then
      Begin

       mHead.backbutton.fxFadeOut(0.1,
          procedure ()
          begin
            mHead.Title.Caption:=mOldTitle;
            mHead.backbutton.Visible:=False;
            mHead.LayoutChildren;
            w3_callback( procedure ()
              Begin
                Application.gotoForm('mainform',feToLeft);
              end,
              10);
          end);

      end else
      Application.gotoForm('mainform',feToLeft);
    end;   }
end;

procedure TformProfile.FormDeactivated;
Begin
  inherited;
end;
 
end.

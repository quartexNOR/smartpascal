unit casebook;

interface

uses 
  W3System, W3Components, W3Forms, W3Application,
  mainForm, w3header,w3toolbutton, w3graphics,

  qtxutils,
  qtxeffects,
  qtxheader,
  formLogin,
  formAccount,
  formProfile;

type

  TApplication = class(TW3CustomApplication)
  private
    FForm1:   TForm1;
    FLogin:   TformLogin;
    FProfile: TformProfile;
    FAccount: TformAccount;
    FHeader:  TQTXHeaderBar;
  protected
    procedure ApplicationStarting; override;
  public
    Property  FormLogin:TformLogin read FLogin;
    Property  MainForm:TForm1 read FForm1;
    Property  ProfileForm:TformProfile read FProfile;
    Property  AccountForm:TformAccount read FAccount;
    Property  Header:TQTXHeaderBar read FHeader;
  end;

implementation

{ TApplication}
uses qtxutils;

procedure TApplication.ApplicationStarting;
begin
  (* Link to Font-Awesome *)
  TQTXIOAccess.loadCSS('stylesheet',
  'http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css',NIL);

  (* Setup global header control.
     We have to add a little delay here due to the nature of
     how this control works. *)

  TQTXRuntime.ExecuteDocumentReady( procedure ()
  begin
    Fheader:=TQTXHeaderBar.Create(display);
    FHeader.top:=-1;
    FHeader.Height:=40;
    application.display.layoutchildren;
  end);

  FLogin:=TformLogin.Create(display.view);
  FLogin.name:='FormLogin';
  RegisterFormInstance(FLogin, true);

  FForm1 := TForm1.Create(Display.View);
  FForm1.Name := 'mainForm';
  RegisterFormInstance(FForm1, false);

  FProfile:=TformProfile.Create(display.view);
  FProfile.name:='FormProfile';
  RegisterFormInstance(FProfile,false);

  FAccount:=TformAccount.Create(display.view);
  FAccount.name:='FormAccount';
  RegisterFormInstance(FAccount,false);

  inherited;
end;


end.
